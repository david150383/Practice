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