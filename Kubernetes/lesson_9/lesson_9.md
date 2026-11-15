## Kubernetes Pod Disruption Budget
A Pod Disruption Budget (PDB) defines how many pods must remain available during voluntary disruptions.
Examples of voluntary disruptions:
- Draining a Kubernetes node for maintenance.
- Upgrading a cluster.
- Evicting pods through the Kubernetes Eviction API.
- Moving workloads during infrastructure maintenance.

PDB helps protect your application availability during these operations.

currently you have 2 replicas in tickets service deployment, Imagine Kubernetes schedules both replicas on your cluster in Node 1. An administrator runs kubectl drain node-1 to perform maintenance.

#### PROBLEM – What happens without PDB?
Kubernetes attempts to evict the pods from Node 1.

Both ticketing pods could be evicted, temporarily leaving your application with zero available replicas.

Your Service still exists, but there are no healthy backend pods to handle requests.

This is an availability problem.

> [!NOTE]
> I have copied stage6 project yaml files into stage7 and will change them now for improvements

#### Let's create PDB for tickets service.
<span style="color:blue">Create `tickets-pdb.yaml` file in `autoscaling` folder</span>

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: tickets-pdb
  namespace: tickets-app
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: tickets
```

That's all you need for your initial PDB.

##### **Understand the configuration**

| Configuration     | Meaning                                          |
| ----------------- | ------------------------------------------------ |
| `apiVersion`      | PDB API version                                  |
| `kind`            | PodDisruptionBudget                              |
| `minAvailable: 1` | At least one pod must remain available           |
| `selector`        | Selects pods belonging to your ticketing service |

Notice this:

```
selector:
  matchLabels:
    app: tickets
```

It matches your existing Deployment labels:

```
template:
  metadata:
    labels:
      app: tickets
```

This is important. If the selector doesn't match your pods, the PDB won't protect the intended workload.

##### How does PDB work?
Suppose your Deployment has two healthy replicas.
**Scenario A:** Two healthy pods
Minimum available: 1
1 disruption allowed

**Scenario B:** One pod evicted
Minimum available: 1
0 disruptions allowed
Another voluntary eviction is blocked until availability is restored.

The Deployment controller will normally create a replacement pod for the evicted pod.

Once that replacement becomes Ready, another eviction can be permitted.

#### Apply and verify
<span style="color:blue">Let's apply it</span>
```
kubectl apply -f autoscaling/tickets-pdb.yaml
```
**Output**
```
poddisruptionbudget.policy/tickets-pdb created
```

<span style="color:blue">Check the PDB</span>
```
kubectl get pdb -n tickets-app
```
**Output**
```
NAME          MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
tickets-pdb   1               N/A               0                     29s
```

<span style="color:blue">Inspect detailed information</span>
```
kubectl describe pdb tickets-pdb -n tickets-app
```
**Output**
```
Name:           tickets-pdb
Namespace:      tickets-app
Min available:  1
Selector:       app=tickets
Status:
    Allowed disruptions:  0
    Current:              0
    Desired:              1
    Total:                3
Events:                   <none>
```

## Kubernetes Pod Topology Spread Constraints

We implemented a Pod Disruption Budget (PDB) to protect your ticketing service during voluntary disruptions.

Now let's solve another production problem: **making sure your replicas are distributed across Kubernetes nodes.**

currently you have 2 replicas in tickets service deployment,

Kubernetes schedules pods based on resource availability, scheduling constraints and other factors.

It does not automatically guarantee that two replicas will run on different nodes.

Imagine this situation:

**Current possible scheduling**

**Node 1**

2 replicas

Tickets Pod 1

Tickets Pod 2

**Node 2**

0 replicas

Available capacity

If Node 1 fails, both ticketing pods become unavailable.

### 1. PROBLEM – Why is this dangerous?

Imagine your production cluster has three worker nodes:

- Node 1
- Node 2
- Node 3

You have two ticketing replicas.

If both replicas happen to run on Node 1, a node failure can take down your entire ticketing service.

Remember, your PDB from Lesson 1 doesn't prevent involuntary disruptions such as node failures.

We need another scheduling mechanism.

### 2. AFTER – Topology Spread Constraints

Kubernetes provides `topologySpreadConstraints` to distribute pods across infrastructure topology domains.

Common topology keys:

| Topology key                    | Distribution              |
| ------------------------------- | ------------------------- |
| `kubernetes.io/hostname`        | Across nodes              |
| `topology.kubernetes.io/zone`   | Across availability zones |
| `topology.kubernetes.io/region` | Across regions            |

For now, we'll distribute your ticketing pods across nodes.

### Update your Deployment
<span style="color:blue">Update `tickets-depl.yaml` file</span>
Add this under `spec.template.spec` in your existing Deployment.

```yaml
spec:
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: kubernetes.io/hostname
      whenUnsatisfiable: DoNotSchedule
      labelSelector:
        matchLabels:
          app: tickets
          
  containers:
```
#### Understand each property

**maxSkew: 1**

This defines the maximum permitted difference in the number of matching pods between eligible topology domains.

For example:

| Node   | Tickets pods |
| ------ | ------------ |
| Node 1 | 1            |
| Node 2 | 1            |
| Node 3 | 0            |

This is a valid distribution because the difference between the most and least populated eligible domains is 1.

**topologyKey**

```
topologyKey: kubernetes.io/hostname
```

Tells Kubernetes to distribute pods based on node hostname labels.

**whenUnsatisfiable**

```
whenUnsatisfiable: DoNotSchedule
```

This is important.

It means Kubernetes should not schedule a pod if doing so would violate the topology spread constraint.

Alternative:

```
whenUnsatisfiable: ScheduleAnyway
```

This tells Kubernetes to try to achieve an even distribution but allows scheduling even if the constraint cannot be satisfied.

For production availability requirements, `DoNotSchedule` is useful when you have sufficient eligible nodes.

**labelSelector**

```
labelSelector:
  matchLabels:
    app: tickets
```

This identifies which pods Kubernetes should count when calculating distribution.

It matches your existing Deployment labels.

#### Understand the scheduling difference

**Desired distribution with three nodes**

**Node 1**

1 pod

Tickets Pod 1

**Node 2**

1 pod

Tickets Pod 2

**Node 3**

0 pods

Replicas are distributed across separate nodes.

### PRACTICE – Test in your Kubernetes cluster
<span style="color:blue">Step 1: Apply configurations</span>
```
kubectl apply -f deployments
```

<span style="color:blue">Step 2: Check your nodes</span>

```
kubectl get nodes -o wide
```
**Output**
```
NAME             STATUS   ROLES           AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE         KERNEL-VERSION      CONTAINER-RUNTIME
docker-desktop   Ready    control-plane   4d19h   v1.34.1   192.168.65.3   <none>        Docker Desktop   6.12.54-linuxkit    docker://29.1.3
```

<span style="color:blue">Step 3: Check existing pod distribution</span>

```
kubectl get pods -n tickets-app -l app=tickets -o wide
```
**Output**
```
NAME                            READY   STATUS    RESTARTS      AGE     IP          NODE             NOMINATED NODE   READINESS GATES
tickets-depl-5c7b65dd66-wqc68   0/1     Pending   0             2d23h   <none>      <none>           <none>           <none>
tickets-depl-7b8c8d7f6b-cdgkb   0/1     Pending   0             3d      <none>      <none>           <none>           <none>
tickets-depl-7b8c8d7f6b-wznkg   0/1     Running   3 (28m ago)   3d21h   10.1.5.66   docker-desktop   <none>           <none>
```
Pay attention to the `NODE` column.

<span style="color:blue">Step 4: Inspect scheduling constraints</span>

```
kubectl describe deployment tickets-depl -n tickets-app
```

You can also inspect the actual pod specification:

```
kubectl get pods -n tickets-app -l app=tickets -o yaml
```

### Important: Your local Docker Desktop cluster

I remember your learning environment uses Docker Desktop Kubernetes.

If you have only one Kubernetes node, this constraint has an important consequence:

- First ticketing pod can be scheduled.
- Second ticketing pod may remain Pending with `DoNotSchedule`.
- This is expected because Kubernetes cannot distribute replicas across two different nodes when only one eligible node exists.

You can verify this using:

```
kubectl describe pod <pending-pod-name> -n tickets-app
```

Look for `FailedScheduling` events.

Don't change it to `ScheduleAnyway` just to make the pods run. Understand the infrastructure limitation first.

### Production knowledge: Topology Spread vs Pod Anti-Affinity

You might also encounter `podAntiAffinity`.

| Feature               | Topology Spread                  | Pod Anti-Affinity                    |
| --------------------- | -------------------------------- | ------------------------------------ |
| Purpose               | Balance pods across domains      | Avoid placing matching pods together |
| Flexible distribution | Yes                              | More restrictive                     |
| Supports skew         | Yes                              | No direct equivalent                 |
| Zone distribution     | Yes                              | Yes                                  |
| Production use        | Excellent for balanced placement | Useful for strict separation         |

For your ticketing service, I prefer topology spread constraints as the starting point.

## Kubernetes : Graceful Shutdown – Node.js + Kubernetes

This is one of the most important production improvements for your ticketing microservice.

Your application uses Node.js, MongoDB and NATS. We need to ensure that when Kubernetes terminates a pod, the application can finish processing existing requests and safely close its connections.

Imagine you're deploying version 1.3 of your ticketing service.

Kubernetes starts replacing your existing 1.2 pods.

Meanwhile:
- A customer is creating a ticket.
- Another request is updating a ticket.
- Your application is publishing an event to NATS.
- MongoDB is processing a database operation.
Kubernetes eventually sends a termination signal to the container.

By default, the container's main process receives SIGTERM.

If your Node.js application doesn't handle it properly, ongoing operations can be interrupted.

### PROBLEM – What can go wrong?
Consider this scenario:
#### Ticket creation in progress
1. Customer sends POST /api/tickets.
2. Node.js starts processing the request.
3. Kubernetes sends SIGTERM.
4. Application terminates before completing the operation.
5. Customer receives a failed request or experiences an uncertain outcome.

This can cause:
- Interrupted HTTP requests.
- Incomplete application cleanup.
- NATS messages left unacknowledged.
- Database connections not closed cleanly.
- Duplicate operations if clients retry without idempotency.

Important: Graceful shutdown reduces these risks, but it doesn't guarantee exactly-once processing. Your ticket creation and event publishing should also use idempotency and reliable messaging patterns.

### AFTER – Configure Kubernetes
<span style="color:blue">Step 1: Update your Deployment files `tickets-depl.yaml`</span>
Add the following under spec.template.spec:
```yaml
spec:
  terminationGracePeriodSeconds: 45
```

#### What does terminationGracePeriodSeconds do?

It tells Kubernetes how long to wait before forcefully terminating the container.

**Pod termination timeline**

1. **T = 0 seconds**

   Kubernetes begins pod termination and sends SIGTERM to the container's main process.
2. **During grace period**

   Your Node.js application stops accepting new requests and finishes ongoing work.
3. **Before 45 seconds**

   Application closes NATS and MongoDB connections and exits.
4. **T = 45 seconds**

   If the container is still running, Kubernetes can forcefully terminate it using SIGKILL.

One subtle detail: Kubernetes also runs the pod termination lifecycle, including endpoint removal and any configured `preStop` hook. Endpoint removal and SIGTERM can overlap; don't assume traffic stops instantly when SIGTERM arrives.

<span style="color:blue">Step 2: Implement graceful shutdown in Node.js</span>
We already handled this in our appliaction, so no need to do anything

### PRACTICE – Test in your Kubernetes cluster
<span style="color:blue">Step 1: Apply configurations</span>
```
kubectl apply -f deployments
```

In recent few lessions, I updated only `tickets-depl.yaml`, but we should also do same for other deployments as well except mongo, nats and redis.

### Production considerations

A few additional things to remember:

1. **Idempotency:** A client may retry a request if its response is lost during termination.
2. **Readiness:** Set readiness to unhealthy during shutdown.
3. **Connection draining:** Handle HTTP keep-alive, WebSockets and streaming connections where applicable.
4. **NATS:** Drain subscriptions and acknowledge messages only after successful processing.
5. **Timeouts:** Make sure shutdown operations finish before the Kubernetes grace period expires.
6. **Docker ENTRYPOINT:** Your Node.js process should receive SIGTERM. Use exec-form ENTRYPOINT rather than launching Node.js through an unmanaged shell process.