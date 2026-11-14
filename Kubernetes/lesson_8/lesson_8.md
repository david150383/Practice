
## Kubernetes Autoscaling

**Kubernetes autoscaling** is the process of automatically adjusting computing resources in a cluster to match real-time application demand. It dynamically scales pods, containers, and underlying server nodes up or down to keep applications responsive during traffic spikes while eliminating wasted infrastructure costs during quiet periods.

> [!NOTE]
> Existing files don't need any change for `Autoscaling`, So we will use stage6 project yaml files for improvements

### The big picture
```text
                 Kubernetes Autoscaling
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       HPA              VPA       Node Autoscaling
        │                │                │
   # of Pods        Pod resources      EC2 Nodes
        │                │                │
   CPU / Memory      CPU / Memory    Karpenter /
   Custom Metrics    requests        Cluster Autoscaler
```

---

### 1. HPA — Horizontal Pod Autoscaler

**Purpose:** Change **number of Pods**.

```text
5 Pods → 10 Pods
```

Typical metrics:

* CPU
* Memory
* Requests/sec
* Kafka lag
* Queue depth
* Custom/external metrics

#### Basic formula

```text
desired replicas ≈ current replicas × (current metric / target metric)
```

Example:

```text
Current replicas = 5
Current CPU       = 80%
Target CPU        = 50%

5 × (80 / 50) = 8
```

So HPA wants approximately **8 Pods**.

#### Important settings

```yaml
minReplicas: 2
maxReplicas: 20
```

These put boundaries around scaling.

#### HPA Custom Metrics

Instead of CPU, you can scale based on business/application metrics.

Example:

```text
Current:
  5 Pods
  500 requests/sec

Target:
  100 requests/sec/pod
```

Therefore:

```text
500 / 100 = 5 Pods
```

If traffic becomes:

```text
1000 requests/sec
```

then:

```text
1000 / 100 = 10 Pods
```

#### Common custom metrics

```text
requests/sec/pod
Kafka consumer lag
queue messages
active connections
HTTP requests
application latency
```

The key idea:
> **Current metric ÷ target metric determines the scaling pressure.**

#### Let's create HPA for `tickets service pod` (`tickets-depl.yaml`)
<span style="color:blue">Create an `autoscaling` folder in `stage6` folder, Then create `tickets-hpa.yaml` file in `autoscaling` folder</span>

```
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: tickets-hpa
  namespace: tickets-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: tickets-depl

  minReplicas: 2
  maxReplicas: 10

  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60

  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Pods
          value: 4
          periodSeconds: 60

    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 25
          periodSeconds: 60
```
##### Important Points
- `kind:` For HPA kind should be always `HorizontalPodAutoscaler`
- `namespace:` Namespace should be same as deployment. HPA can only scale a Deployment in the same namespace.
- `scaleTargetRef:` Here we specify which Deployment we want to target. So name should match with targeting deployment name.
##### How it behaves
- CPU utilization rises above the target: Kubernetes adds Pods as needed.
- CPU utilization falls: Kubernetes can remove Pods, subject to the scale-down policy.
- Minimum replicas: 2.
- Maximum replicas: 10.
- Scale-down stabilization: 5 minutes to help avoid unnecessary fluctuations.

The CPU target is calculated relative to the CPU request, not the CPU limit. With a 500m CPU request and a 60% target, the target average usage is approximately 300m per Pod.

Let's understand each setting.

| Setting | Meaning |
| --- | --- |
| `metrics` | Defines what metrics HPA should monitor. |
| `type: Resource` | Monitor Kubernetes resource metrics, such as CPU or memory. |
| `resource` | Specifies which resource to monitor. |
| `name: cpu` | Monitor CPU utilization. |
| `target` | Defines the desired resource usage. |
| `type: Utilization` | Calculate usage as a percentage of the resource request. |
| `averageUtilization: 60` | Target average CPU utilization of 60%. |

##### How does averageUtilization: 60 work?

Your Deployment has:

```yaml
resources:
  requests:
    cpu: "500m"
  limits:
    cpu: "1"
```

Here:

- `500m` = 0.5 CPU core.
- `1` = 1 full CPU core.

Your HPA target is 60%.

Calculation:

$$
500m \times \frac{60}{100} = 300m
$$

So HPA tries to maintain average CPU consumption around 300m per pod.

##### Practical example

Assume you have 2 pods:

| Pod | CPU usage | CPU request | Utilization |
| --- | --- | --- | --- |
| Pod 1 | 400m | 500m | 80% |
| Pod 2 | 500m | 500m | 100% |

Average utilization:

$$
\frac{80+100}{2}=90\%
$$

Your target is 60%, but actual usage is 90%.

Therefore, HPA tries to increase the number of pods.

The basic scaling formula is:

$$
DesiredReplicas =
\left\lceil
CurrentReplicas \times
\frac{CurrentMetric}{TargetMetric}
\right\rceil
$$

For your example:

$$
\left\lceil 2 \times \frac{90}{60}\right\rceil
=3
$$

HPA calculates 3 desired replicas.

##### 1. Understanding behavior

Your configuration:

```yaml
behavior:
  scaleUp:
    stabilizationWindowSeconds: 0
    policies:
      - type: Pods
        value: 4
        periodSeconds: 60

  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
      - type: Percent
        value: 25
        periodSeconds: 60
```

The `behavior` section controls how quickly Kubernetes can increase or decrease the number of pods.

Without custom behavior, Kubernetes uses its default scaling policies.

You are overriding those policies.

There are two directions:

- `scaleUp`: Increase the number of pods.
- `scaleDown`: Decrease the number of pods.

##### 2. Understanding scaleUp

Your configuration:

```yaml
scaleUp:
  stabilizationWindowSeconds: 0
  policies:
    - type: Pods
      value: 4
      periodSeconds: 60
```

Let's break it down.

###### A. stabilizationWindowSeconds: 0

This means Kubernetes doesn't wait for a stabilization period before scaling up.

For example:

- Current replicas: 2
- CPU suddenly increases.
- HPA calculates desired replicas: 6.
- It can scale up immediately, subject to the scaling policy.

If you configured:

yaml

```yaml
stabilizationWindowSeconds: 60
```

Kubernetes would consider recent recommendations over a 60-second window when deciding the scaling recommendation.

For scale-up, the default stabilization window is zero.

###### B. type: Pods

This tells Kubernetes that the scaling policy is based on a fixed number of pods.

###### C. value: 4

**Important setting**
This means:

Kubernetes can add a maximum of 4 pods during the specified time period.

For example:

Your current replicas = 2.

Your HPA wants to scale to 10.

But your scale-up policy allows only 4 additional pods per 60 seconds.

So:

Scale-up example **2** Current pods

**6** After scaling

2 existing pods + maximum 4 additional pods

| Time | Replicas |
| --- | --- |
| Initial | 2 |
| Within first 60 seconds | Up to 6 |
| Next 60 seconds | Up to 10 |

Remember: `value: 4` does not mean Kubernetes will always add 4 pods. It means 4 is the maximum allowed by this policy.

###### D. periodSeconds: 60

This defines the time window for evaluating the scaling policy.

Here:

```yaml
periodSeconds: 60
```

Means the policy permits a maximum increase of 4 pods over a 60-second period.

##### 3. Understanding scaleDown

Your configuration:

```yaml
scaleDown:
  stabilizationWindowSeconds: 300
  policies:
    - type: Percent
      value: 25
      periodSeconds: 60
```

Scale-down is particularly important because you don't want Kubernetes to remove pods immediately when CPU usage decreases temporarily.

###### A. stabilizationWindowSeconds: 300

300 seconds = 5 minutes.

This tells Kubernetes to consider recommendations from the previous 5 minutes when deciding how many replicas to keep.

For scale-down, Kubernetes uses the highest desired replica recommendation within that stabilization window.

Example:

| Time | HPA desired replicas |
| --- | --- |
| 10:00 | 8 |
| 10:01 | 6 |
| 10:02 | 4 |
| 10:03 | 3 |
| 10:04 | 2 |
| 10:05 | 2 |

Even though CPU usage decreases, HPA doesn't immediately reduce replicas to 2.

It considers the previous 5 minutes of recommendations to avoid aggressive scaling down.

###### B. type: Percent

This means scaling is controlled by a percentage of the current number of replicas.

Unlike `Pods`, which uses a fixed number, `Percent` uses a percentage.

###### C. value: 25

This means Kubernetes can remove a maximum of 25% of the current replicas during the specified period.

Let's understand with examples:

| Current replicas | 25% | Maximum pods removed (rounded up) |
| --- | --- | --- |
| 4 | 1 | 1 |
| 8 | 2 | 2 |
| 10 | 2.5 | 3 |
| 20 | 5 | 5 |

For example:

If you have 8 pods:

$$
8 \times 25\% = 2
$$

Kubernetes can remove at most 2 pods within the 60-second policy period.

So:

8 → 6

If you have 10 pods:

$$
10 \times 25\% = 2.5
$$

Kubernetes rounds the allowed reduction up to 3 pods.

So:

10 → 7

###### D. periodSeconds: 60

This means the scale-down policy allows that maximum reduction over a 60-second period.

##### 4. ScaleUp vs ScaleDown comparison

This is the most important comparison to remember.

| Configuration | ScaleUp | ScaleDown |
| --- | --- | --- |
| Stabilization window | 0 seconds | 300 seconds |
| Policy type | Pods | Percent |
| Value | 4 | 25 |
| Period | 60 seconds | 60 seconds |
| Meaning | Add up to 4 pods | Remove up to 25% of pods |

Your configuration is designed to:

- Scale up quickly when traffic increases.
- Avoid scaling down immediately when traffic decreases.
- Protect your application from frequent pod creation and deletion.

##### 5. Visual example of your HPA behavior

Your HPA scaling configuration

Scale up

Fast

<span style="font-size: 1.5em;">+4 pods</span>

Maximum increase per 60-second period

Scale down

Conservative

<span style="font-size: 1.5em;">−25%</span>

Maximum reduction per 60-second period

Scale-down waiting window 5 minutes

Minimum replicas 2

Maximum replicas 10

##### 6. One more important concept: selectPolicy

Kubernetes also supports:

```yaml
selectPolicy: Max
```

This becomes particularly useful when you configure multiple scaling policies.

For example:

```yaml
scaleUp:
  stabilizationWindowSeconds: 0
  selectPolicy: Max
  policies:
    - type: Pods
      value: 4
      periodSeconds: 60
    - type: Percent
      value: 100
      periodSeconds: 60
```

Here:

- One policy allows adding 4 pods.
- Another allows increasing replicas by 100%.
- `selectPolicy: Max` chooses whichever policy permits the larger increase.

For scale-down, `selectPolicy: Min` would choose the policy that permits the smaller reduction.

These are optional settings. Your existing configuration already has a valid default selection policy.

#### Test your HPA in Docker Desktop
<span style="color:blue">For just test change `tickets-depl.yaml` requests cpu from 500 to 100, so we can see HPA working</span>

```yaml
image: ticketing-nats-tickets-app:1.2
resources:
  requests:
    cpu: "100m"
```
<span style="color:blue">Apply your configurations</span>
As we already used apply command for configMap, secrets and deployments, so for now just use for autoscaling file and tickets-depl.yaml.
```
kubectl apply -f autoscaling/
kubectl apply -f deployments/tickets-depl.yaml
```
**Output**
```
horizontalpodautoscaler.autoscaling/tickets-hpa created
deployment.apps/tickets-depl configured
service/tickets-srv unchanged
```

For now i have created HPA only for ticket service, but after this test, we will also do same for other services as well.

<span style="color:blue">After applying the HPA, run these commands:/span>

**Step 1:** Terminal 1 – Watch HPA:
```bash
kubectl get hpa -n tickets-app -w
```
**Output**
```
NAME          REFERENCE                 TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
tickets-hpa   Deployment/tickets-depl   cpu: 1%/60%   2         10        2          26m
```
You can notice right now cpu is only 1% because there is no traffic. Also we run above command in watch mode so it will keep update and show a new line with updated usage.

**Step 1:** Terminal 2 – Watch pods:
```bash
kubectl get pods -n tickets-app -w
```

**Step 1:** Terminal 3 – Monitor CPU:
```bash
kubectl top pods -n tickets-app
```
**Output**
```
NAME                                     CPU(cores)   MEMORY(bytes)   
auth-depl-7c89cc7c6d-gvn4g               4m           57Mi            
client-depl-7f4949498c-pdc8j             1m           14Mi            
expiration-depl-57f97c5f67-f94dh         3m           28Mi            
expiration-redis-depl-56c5cd8cf6-nmx8r   6m           20Mi            
mongo-app-depl-77d6f75958-gg5nb          11m          259Mi           
nats-depl-6468fdb94d-gz5v5               4m           22Mi            
orders-depl-f845f9bbd-w6869              6m           33Mi            
payments-depl-78dcdd4c46-lqqjk           4m           62Mi            
tickets-depl-7b8c8d7f6b-wznkg            4m           40Mi 
```
<span style="color:blue">Hit `http://ticketing.test:8080/api/tickets` api 500 times using postman `Run collection`</span>

You can observe the relationship between CPU utilization and replica count.

One important note: HPA decisions are periodic (the default controller sync interval is typically 15 seconds), and actual pod startup takes additional time. Your `periodSeconds: 60` is a scaling-policy rate window, not a guarantee that scaling happens exactly every 60 seconds.

---

### 2. VPA — Vertical Pod Autoscaler

**Purpose:** Change the **CPU/memory resources requested by Pods**.

Instead of:

```text
5 Pods → 10 Pods
```

VPA does something like:

```text
CPU:
500m → 1000m

Memory:
512Mi → 2Gi
```

VPA looks at workload usage/history and recommends appropriate resource requests.

#### VPA does NOT do this

```text
t3.medium → t3.large
```

That's **node/EC2 scaling**, not VPA.

#### Let's create VPA for `tickets service pod` (`tickets-depl.yaml`)
<span style="color:blue">Create `tickets-vpa.yaml` file in `autoscaling` folder</span>

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: tickets-vpa
  namespace: tickets-app
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: tickets-depl

  updatePolicy:
    # Automatically apply updated resource requests.
    updateMode: Recreate

  resourcePolicy:
    containerPolicies:
      - containerName: tickets

        # Resources VPA is allowed to manage.
        controlledResources:
          - cpu
          - memory

        # Change requests, but keep your existing limits.
        controlledValues: RequestsOnly

        # Minimum resources allowed.
        minAllowed:
          cpu: 250m
          memory: 256Mi

        # Maximum resources allowed.
        maxAllowed:
          cpu: "1"
          memory: 1Gi
```

##### Important Points
- `kind:` For VPA kind should be always `VerticalPodAutoscaler`
- `namespace:` Namespace should be same as deployment. VPA can only scale a Deployment in the same namespace.

A. updateMode
```yaml
updatePolicy:
  updateMode: Recreate
```
VPA supports different update modes:

| Mode | Behavior |
| --- | --- |
| `Off` | Only generates recommendations |
| `Initial` | Applies resources when pods are created |
| `Recreate` | Updates resources by evicting and recreating pods |
| `InPlaceOrRecreate` | Attempts in-place updates, otherwise recreates pods |

I'd use Recreate for compatibility across VPA installations. If your Kubernetes version and VPA release support in-place resource resizing, you can evaluate `InPlaceOrRecreate`.

Important: Recreate can restart pods when recommendations change. It does not guarantee zero downtime by itself.

b. minAllowed and maxAllowed
```yaml
minAllowed:
  cpu: 250m
  memory: 256Mi

maxAllowed:
  cpu: "1"
  memory: 1Gi
```

These are safety boundaries.

| Resource | Minimum | Maximum |
| --- | --- | --- |
| CPU | 250m | 1000m |
| Memory | 256Mi | 1Gi |

For example:

- If your application needs 300m CPU, VPA can recommend 300m.
- If it needs 700m CPU, VPA can recommend 700m.
- If it needs 1.5 CPU, VPA cannot exceed your configured maximum of 1 CPU.

The same principle applies to memory.

These are starting guardrails, not universal optimal values. Tune them after observing actual workload behavior.

C. controlledValues
```yaml
controlledValues: RequestsOnly
```

This is particularly important for your Deployment.

Your existing configuration has:

```yaml
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "1"
    memory: "1Gi"
```

With `RequestsOnly`:

- VPA can adjust CPU requests.
- VPA can adjust memory requests.
- CPU limits remain at `1`.
- Memory limits remain at `1Gi`.

This gives you automatic resource optimization without allowing VPA to change your existing container limits.


#### Let's apply VPA configuration 

##### First, make sure VPA is installed in your Kubernetes cluster.

VPA requires its components:

- Recommender
- Updater
- Admission Controller

You can check whether VPA is installed:

```bash
kubectl get crd verticalpodautoscalers.autoscaling.k8s.io
```
**Output**
```
Error from server (NotFound): customresourcedefinitions.apiextensions.k8s.io "verticalpodautoscalers.autoscaling.k8s.io" not found
```

**Notice:** As per above output CRD not installed

###### Install VPA**
For a standard Kubernetes installation, clone the official VPA repository:
```
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler
```
Run the installation script:
```
./hack/vpa-up.sh
```


###### If the CRD exists, check the VPA components:
```bash
kubectl get pods -n kube-system | grep vpa
```

Apply your manifests:

```bash
kubectl apply -f autoscaling/tickets-vpa.yaml
```
**Output**
```
verticalpodautoscaler.autoscaling.k8s.io/tickets-vpa created
```

Check VPA status:

bash

```bash
kubectl get vpa -n tickets-app
```

Get detailed recommendations:

bash

```bash
kubectl describe vpa tickets-vpa -n tickets-app
```

#### Production recommendations

I'd follow this rollout strategy:

| Stage | Configuration | Duration |
| --- | --- | --- |
| 1 | `updateMode: Off` | 7–14 days |
| 2 | Review VPA recommendations | Before enabling updates |
| 3 | `updateMode: Recreate` | Production rollout |
| 4 | Monitor resource usage and restarts | Ongoing |

Why start with `Off`?

Because you don't want VPA changing resource requests immediately without understanding your application's normal traffic patterns.

After collecting sufficient metrics, switch to `Recreate`.
#### Important things to remember

1. VPA does not increase or decrease replicas. It adjusts CPU and memory requests. HPA handles replica scaling.
2. Avoid CPU-based HPA and VPA controlling CPU requests together without a deliberate design. Changing CPU requests affects HPA utilization calculations.
3. Memory is particularly important for Node.js applications. Monitor heap usage, RSS, and container OOM kills.
4. Keep resource limits reasonable. VPA recommendations cannot exceed the configured maximum in this configuration.
5. Two replicas are a relatively small availability margin. Consider three or more replicas for critical production workloads, depending on capacity and availability requirements.
---

### 3. Node Autoscaling

Node autoscaling changes the amount/type of compute capacity available to Kubernetes.

For example:

```text
Current:

EC2 Node 1: t3.medium
EC2 Node 2: t3.medium

        ↓ workload increases

EC2 Node 3 added
```

Or with a provisioning system such as Karpenter, Kubernetes may get a different suitable instance type.

#### Main options

**Cluster Autoscaler**

```text
Add/remove nodes
```

**Karpenter**

```text
Provision right-sized AWS capacity based on pending workload
```

---

### 4. The most important distinction

| Component              | Changes           | Example                 |
| ---------------------- | ----------------- | ----------------------- |
| **HPA**                | Number of Pods    | 5 → 10 Pods             |
| **VPA**                | Pod CPU/memory    | 500m → 1 CPU            |
| **Karpenter**          | Node/EC2 capacity | Add/change EC2 capacity |
| **Cluster Autoscaler** | Number of nodes   | 3 → 5 nodes             |

---

### 5. How they can work together

Imagine an application suddenly receives lots of traffic:

```text
              Traffic increases
                     │
                     ↓
                    HPA
                     │
              Need more Pods
                     │
                     ↓
          Pods cannot fit on nodes
                     │
                     ↓
              Karpenter/CA
                     │
                     ↓
             More EC2 capacity
                     │
                     ↓
              Pods get scheduled
```

At the same time:

```text
VPA
 ↓
Observes Pod CPU/memory usage
 ↓
Recommends better resource requests
```

So you can think:

```text
HPA       = "How many Pods?"
VPA       = "How big should each Pod be?"
Karpenter = "Where/how do I get enough compute?"
```

---

### 6. One interview-friendly example

Suppose:

```text
Application
├── 5 Pods
├── CPU target = 50%
└── Each Pod requests 500m CPU
```

Traffic increases.

#### HPA

CPU reaches 100%.

```text
5 × (100 / 50)
= 10 Pods
```

HPA wants **10 Pods**.

#### But nodes don't have enough capacity

Some Pods become:

```text
Pending
```

#### Karpenter / Cluster Autoscaler

Sees unschedulable Pods and provisions additional node capacity.

#### VPA

Meanwhile, if each Pod consistently needs more CPU:

```text
500m → 800m
```

VPA can recommend/in some modes apply a larger CPU request.

---

### 7. Easy memory trick

Remember **H-V-N**:

```text
H = Horizontal → How many Pods?

V = Vertical   → How much CPU/Memory per Pod?

N = Nodes      → How much infrastructure/EC2 capacity?
```

Or even simpler:

> **HPA = scale OUT**
> **VPA = scale UP**
> **Karpenter/CA = scale the cluster**

One caveat: **HPA + VPA together need careful configuration**, especially if both try to control CPU/memory-related behavior. In production, it's common to use HPA for replica count and VPA in recommendation mode for right-sizing.

