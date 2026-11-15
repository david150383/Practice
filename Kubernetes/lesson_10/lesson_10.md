## Kubernetes Container Security Context

So far, we've improved availability and reliability. Now let's improve security.

The objective is simple:

**If an attacker manages to compromise your ticketing container, we should limit what they can do inside that container.**

We'll use Kubernetes securityContext and Linux security features.


> [!NOTE]
> I have copied stage7 project yaml files into stage8 and will change them now for improvements

### Step 1: Make sure your application not running as root user
Depending on your Docker image, the application might be running as root.

<span style="color:blue">Run below command with tickets service pod name</span>

```bash
 kubectl exec -it tickets-depl-7b8c8d7f6b-wznkg -n tickets-app -- id
```
**Output**
```
uid=1000(node) gid=1000(node) groups=1000(node)
```
You can see we already have non-root user in our image Dockerfile_prod
```
.....
# Security: run as non-root
USER node

EXPOSE 3000
.....
```

But If you see below, means application is running as root. This is not desirable for a production application.
```
uid=0(root) gid=0(root)
```

### Step 2: Configure Pod-level Security Context
<span style="color:blue">Update `tickets-depl.yaml` file</span>
Add this under spec.template.spec:

```yaml
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000

        seccompProfile:
          type: RuntimeDefault
```

Let's understand these settings.


| Property       | Purpose                          |
| -------------- | -------------------------------- |
| runAsNonRoot   | Prevents running as root         |
| runAsUser      | Specifies Linux UID              |
| runAsGroup     | Specifies Linux primary group    |
| seccompProfile | Restricts available system calls |

`RuntimeDefault` uses the container runtime's default seccomp profile.

### Step 3: Configure Container-level Security Context
<span style="color:blue">Update `tickets-depl.yaml` file</span>
Add this under your container:

```
containers:
  - name: tickets

    securityContext:
      allowPrivilegeEscalation: false

      readOnlyRootFilesystem: true

      capabilities:
        drop:
          - ALL
```

Understand each property:

**allowPrivilegeEscalation: false**

Prevents the process from gaining additional privileges through mechanisms such as setuid binaries.

**readOnlyRootFilesystem: true**

Prevents modification of the container's root filesystem.

For example, an attacker cannot simply modify files under `/app` if they are on the root filesystem.

**capabilities.drop: ALL**

Removes Linux capabilities from the container.

Linux capabilities divide traditionally powerful root privileges into smaller permissions.

For a typical Node.js HTTP service listening on port 3001, you generally don't need additional Linux capabilities.



### Step 4. Important: Read-only filesystem and temporary directories

This is where many people encounter problems.

Your Node.js application or dependencies might write files to:

- `/tmp`
- `/app/uploads`
- `/app/logs`

After enabling:

```
readOnlyRootFilesystem: true
```

these writes will fail unless writable volumes are provided.

**Solution: Use emptyDir volumes.**

Add:

```
spec:
  template:
    spec:
      volumes:
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi

      containers:
        - name: tickets

          volumeMounts:
            - name: tmp
              mountPath: /tmp
```

Now `/tmp` is writable, while the rest of the root filesystem remains read-only.

Remember:

- `emptyDir` survives container restarts while the Pod remains on the node.
- It is deleted when the Pod is removed.
- It is not persistent storage.

For permanent ticket attachments, use appropriate persistent or object storage rather than `/tmp`.


### Step 5. PRACTICE – Verify security settings**

Apply your updated Deployment:

```
cd stage8
kubectl apply -f deployments/tickets-depl.yaml
```

Check the pods:

```
kubectl get pods -n tickets-app | grep tickets
```
**Output**
```
tickets-depl-7b8c8d7f6b-wznkg            1/1     Running   3 (3h1m ago)
```

#### Test 1: Verify the user

```
kubectl exec -it tickets-depl-7b8c8d7f6b-wznkg -n tickets-app -- id
```

Expected:

```
uid=1000(node) gid=1000(node)
```

#### Test 2: Verify root filesystem is read-only

```
kubectl exec -it tickets-depl-7b8c8d7f6b-wznkg -n tickets-app -- sh -c 'touch /test-file'
```

Expected:

```
touch: /test-file: Permission denied
```

#### Test 3: Verify /tmp is writable

```
kubectl exec -it tickets-depl-7b8c8d7f6b-wznkg -n tickets-app -- sh -c 'touch /tmp/test-file'
```

Expected: successful execution.

#### Test 4: Inspect security context

```
kubectl get pod tickets-depl-7b8c8d7f6b-wznkg -n tickets-app -o yaml
```

Inspect:

```
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  seccompProfile:
    type: RuntimeDefault
```

And the container-level configuration.

### Production knowledge: Pod Security Standards**

There is another Kubernetes feature worth knowing: **Pod Security Standards (PSS)**.

Kubernetes provides three security levels:

| Level      | Purpose                              |
| ---------- | ------------------------------------ |
| Privileged | Unrestricted workloads               |
| Baseline   | Prevents known privilege escalations |
| Restricted | Strong security requirements         |

For your ticketing application, I recommend eventually enforcing the `restricted` profile.

You can configure namespace-level enforcement:

```
apiVersion: v1
kind: Namespace
metadata:
  name: tickets-app
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

This allows Kubernetes Pod Security Admission to enforce security requirements for workloads in that namespace.

Note that the Restricted profile also has requirements for container capabilities, privilege escalation, seccomp and other settings. Your complete pod specification must satisfy them.

For production, introduce enforcement after auditing existing workloads, because non-compliant pods may be rejected.

---

## Production-grade Rolling Updates and Deployment Strategies

Now let's improve how you deploy new versions of your ticketing microservice.

The goal is:

**Deploy new application versions without interrupting existing users or losing ticket requests.**

Kubernetes Deployments use RollingUpdate by default.

However, you haven't explicitly configured how many pods can be created or terminated during a deployment.

Let's understand why this matters.

### PROBLEM – What happens during deployment?
Imagine your production environment has two replicas running version 1.2.

You want to deploy version 1.3.

If you configure an aggressive update strategy, Kubernetes could terminate old pods before new pods become ready.

That can temporarily reduce your available capacity or cause downtime.

### AFTER – Configure RollingUpdate
<span style="color:blue">Update `tickets-depl.yaml` file</span>
```
spec:
  replicas: 2

  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0

  minReadySeconds: 10
  progressDeadlineSeconds: 600
  revisionHistoryLimit: 5
```


Let's understand every property.

#### A. maxSurg

```
maxSurge: 1
```

This specifies the maximum number of additional pods Kubernetes can create above the desired replica count during an update.

Suppose:

- Desired replicas = 2
- maxSurge = 1

Kubernetes can temporarily run three pods.

**During rolling update**

Old **Pod 1** v1.2
Old **Pod 2** v1.2

New **Pod 3** v1.3

Three pods temporarily exist instead of two.

#### B. maxUnavailable

```
maxUnavailable: 0
```

This specifies how many pods can be unavailable during the rolling update.

With zero unavailable pods, Kubernetes should make new pods available before removing old pods.

For your two-replica ticketing service, this is a good starting configuration.

#### C. minReadySeconds

```
minReadySeconds: 10
```

After a pod becomes Ready, Kubernetes waits for it to remain Ready for 10 seconds before considering it available for Deployment rollout progress.

Why is this useful?

Imagine:

1. New pod starts.
2. Readiness probe succeeds.
3. Pod receives traffic.
4. Application immediately crashes.

A short stability period helps avoid treating an immediately unstable pod as successfully available.

It is not a replacement for proper readiness probes.

#### D. progressDeadlineSeconds

```
progressDeadlineSeconds: 600
```

Kubernetes considers a Deployment rollout stalled if it fails to make progress within 600 seconds.

For example:

- Image pull failures.
- Application crashes.
- Readiness probes failing.
- Insufficient cluster resources.

You can inspect the Deployment conditions to identify the failure.

Important: This doesn't automatically roll back your Deployment. It reports a stalled rollout.

#### E. revisionHistoryLimit

```
revisionHistoryLimit: 5
```

Kubernetes retains up to five old ReplicaSets for rollback purposes.

This is useful when a new application version causes problems.


### Understand the complete rolling update

Let's walk through a deployment from version 1.2 to 1.3.

#### Rolling update – 2 replicas

1. **Step 1 – Initial state**

   v1.2

   v1.2

   Two healthy old pods.
2. **Step 2 – Create new pod**

   v1.2

   v1.2

   v1.3

   Kubernetes creates an additional pod.
3. **Step 3 – New pod becomes available**

   The new pod passes its readiness probe and remains Ready for the configured stability period.
4. **Step 4 – Remove an old pod**

   v1.2

   v1.3

   One old pod is terminated.
5. **Step 5 – Create the second new pod**

   v1.2

   v1.3

   v1.3
6. **Step 6 – Complete rollout**

   v1.3

   v1.3

   All replicas run the new version.

Notice how Kubernetes maintains available replicas throughout this process.

**Important interaction with your earlier lessons:**

- Your PDB protects voluntary disruptions.
- `maxUnavailable: 0` controls Deployment rolling updates.
- `maxSurge: 1` requires extra scheduling capacity.
- Topology spread constraints can prevent the additional pod from scheduling if your cluster doesn't have another eligible node.
- Your graceful shutdown implementation handles termination of old pods.

Also, when HPA manages replicas, leave `spec.replicas` out of the Deployment's declarative manifest to avoid competing with the autoscaler.

### PRACTICE – Deploy a new version**

Let's test this.

#### Step 1: Check your current Deployment

```
kubectl get deployment tickets-depl -n tickets-app
```

#### Step 2: Apply the new strategy

```
kubectl apply -f deployments/tickets-depl.yaml
```

#### Step 3: Watch the rollout

```
kubectl rollout status deployment/tickets-depl -n tickets-app
```

#### Step 4: Watch pods during deployment

```
kubectl get pods -n tickets-app -l app=tickets -w
```

#### Step 5: Inspect rollout history

```
kubectl rollout history deployment/tickets-depl -n tickets-app
```

You should see the available Deployment revisions.

### Production scenario – New version has a bug

Now imagine you deployed version 1.3, but customers report that ticket creation is failing.

You need to roll back.

Kubernetes provides:

```
kubectl rollout undo deployment/tickets-depl -n tickets-app
```

Check the rollout:

```
kubectl rollout status deployment/tickets-depl -n tickets-app
```

You can also roll back to a specific revision:

```
kubectl rollout undo deployment/tickets-depl \
  --to-revision=2 \
  -n tickets-app
```

Inspect history:

```
kubectl rollout history deployment/tickets-depl -n tickets-app
```

**Important production consideration:** Kubernetes rollback only restores the previous Deployment specification. It doesn't automatically reverse database migrations, external side effects or messages already published.

For your ticketing application, use backward-compatible database migrations (expand-and-contract) so old and new application versions can safely coexist during deployments.

### Beyond Rolling Updates – Other deployment strategies**

There are three important deployment strategies worth understanding.

#### 1. Rolling Deployment

Your current approach

Old

Old

New

Gradually replaces old pods with new pods.

#### 2. Blue-Green Deployment

Blue

**Version 1.2**

Currently receiving traffic

Green

**Version 1.3**

Test before switching traffic

Run both environments, then switch Service traffic to the new version.

#### 3. Canary Deployment

**Version 1.2**

# **90%**

Traffic

**Version 1.3**

# **10%**

Traffic

Send a small portion of traffic to the new version and evaluate its behavior before increasing traffic.

For advanced deployments, explore:

- Argo Rollouts – Blue-green and canary deployments.
- Flagger – Automated progressive delivery.
- Argo CD – GitOps deployment management.

I recommend learning standard RollingUpdate first, then Argo Rollouts.