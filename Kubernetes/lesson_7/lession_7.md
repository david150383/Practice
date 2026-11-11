## Kubernetes Resource requests/limits

In Kubernetes, you set CPU and memory resources for Pods using `resources.requests` and `resources.limits` inside the container specification.

> [!NOTE]
> I have copied stage5 project yaml files into stage6 and will change them now for improvements

### 1. Requests vs Limits

| Resource | Requests | Limits |
| --- | --- | --- |
| CPU | Minimum CPU guaranteed for scheduling | Maximum CPU the container can use |
| Memory | Minimum memory requested for scheduling | Maximum memory the container can use |

- Requests: Kubernetes uses these values to decide which node has enough available resources to schedule the Pod.
- Limits: Restrict how much CPU and memory a container can consume.
- CPU exceeding its limit is throttled.
- Memory exceeding its limit can cause the container to be terminated with `OOMKilled`.

### 2. Common CPU and Memory Units

CPU:

| Value | Meaning |
| --- | --- |
| `100m` | 0.1 CPU |
| `250m` | 0.25 CPU |
| `500m` | 0.5 CPU |
| `1000m` | 1 CPU |
| `2` | 2 CPU cores |

Memory:

| Value | Meaning |
| --- | --- |
| `128Mi` | 128 MiB |
| `256Mi` | 256 MiB |
| `512Mi` | 512 MiB |
| `1Gi` | 1 GiB |
| `2Gi` | 2 GiB |


### 3. Resource configuration in Deployment

In real-world applications, you generally configure resources in Deployment manifests.

<span style="color:blue">Let's update `tickets-depl.yaml` for tickets service</span>

```yaml
image: ticketing-nats-tickets-app:1.2
resources:
requests:
    cpu: "500m"
    memory: "512Mi"
limits:
    cpu: "1"
    memory: "1Gi"
startupProbe:     
```
<span style="color:blue">Let's update other remaining `Deployment` yaml files as well except `Redis, Nats, Mongo`</span>

Here:

- CPU request: `500m` = 0.50 CPU core.
- CPU limit: `1` = 1 CPU core.
- Memory request: `512Mi` = 512 MB Ram.
- Memory limit: `1Gi` = 1GB Ram.

Each replica gets its own resource allocation.

For 3 replicas:

| Resource | Total requests | Total limits |
| --- | --- | --- |
| CPU | 1.5 cores | 3 cores |
| Memory | 1.5 GiB | 3 GiB |



<span style="color:blue">Let's create `configMaps` and `Secrets`, Then delete deployments and Re Create</span>

```
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f deployments/
```

### Let's test application

#### port forward ingress controller as in our local pc port 80 used by apache
```
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
```

#### Open website and unit test
```
http://ticketing.test:8080
```


### 4. How to check Pod resource usage

<span style="color:blue">First make sure Metrics Server is Installed</span>
```
kubectl get pods -n kube-system | grep metrics-server
```
**If no output appears**. The Metrics Server is missing from your cluster. Install the Metrics Server using below two steps.

<span style="color:blue">Step 1. Install the Metrics Server in `Docker Desktop`</span>
```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

<span style="color:blue">Step 2. Configure Docker Desktop compatibility</span>
Docker Desktop may use kubelet certificates that Metrics Server cannot validate.

If you see certificate errors, run this patch:
```
kubectl patch deployment metrics-server \
  -n kube-system \
  --type='json' \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

<span style="color:blue">Check current resource consumption in our `tickets-app` namespace</span>

```bash
kubectl top pods -n tickets-app
```
**Output**
```
NAME                                     CPU(cores)   MEMORY(bytes)   
auth-depl-c644d7f5d-rfpgd                6m           95Mi            
client-depl-54b849fbfc-x4fcj             1m           14Mi            
expiration-depl-7486749cd5-272p7         4m           35Mi            
expiration-redis-depl-56c5cd8cf6-nmx8r   7m           20Mi            
mongo-app-depl-77d6f75958-gg5nb          11m          250Mi           
nats-depl-6468fdb94d-gz5v5               3m           22Mi            
orders-depl-f845f9bbd-w6869              6m           44Mi            
payments-depl-5dbb46f96-2jmrs            5m           48Mi            
tickets-depl-7b8c8d7f6b-wznkg            5m           46Mi
```

<span style="color:blue">Check resource configuration for a pod, in case you don't have yaml file or need to confirm CPU, Memory configuration for that pod</span>

```bash
kubectl describe pod tickets-depl-7b8c8d7f6b-wznkg -n tickets-app
```
**Output**
```
Name:             tickets-depl-7b8c8d7f6b-wznkg
Namespace:        tickets-app
....
    Limits:
      cpu:     1
      memory:  1Gi
    Requests:
      cpu:      500m
      memory:   512Mi
....
```

<span style="color:blue">Check node resource availability</span>

```bash
kubectl describe nodes
```
**Output**
```
Name:               docker-desktop
Roles:              control-plane
....
Non-terminated Pods:          (20 in total)
  Namespace                   Name                                         CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                         ------------  ----------  ---------------  -------------  ---
  ingress-nginx               ingress-nginx-controller-86c5998465-f9kps    100m (1%)     0 (0%)      90Mi (2%)        0 (0%)         22h
  kube-system                 coredns-66bc5c9577-d6cwr                     100m (1%)     0 (0%)      70Mi (1%)        170Mi (4%)     22h
  kube-system                 coredns-66bc5c9577-jw2wn                     100m (1%)     0 (0%)      70Mi (1%)        170Mi (4%)     22h
  kube-system                 etcd-docker-desktop                          100m (1%)     0 (0%)      100Mi (2%)       0 (0%)         22h
  kube-system                 kube-apiserver-docker-desktop                250m (3%)     0 (0%)      0 (0%)           0 (0%)         22h
  kube-system                 kube-controller-manager-docker-desktop       200m (2%)     0 (0%)      0 (0%)           0 (0%)         22h
  kube-system                 kube-proxy-snmsd                             0 (0%)        0 (0%)      0 (0%)           0 (0%)         22h
  kube-system                 kube-scheduler-docker-desktop                100m (1%)     0 (0%)      0 (0%)           0 (0%)         22h
  kube-system                 metrics-server-767bf95dcc-6n8zw              100m (1%)     0 (0%)      200Mi (5%)       0 (0%)         24m
  kube-system                 storage-provisioner                          0 (0%)        0 (0%)      0 (0%)           0 (0%)         22h
  kube-system                 vpnkit-controller                            0 (0%)        0 (0%)      0 (0%)           0 (0%)         22h
  tickets-app                 auth-depl-7c89cc7c6d-gvn4g                   500m (6%)     1 (12%)     512Mi (13%)      1Gi (26%)      7m32s
  tickets-app                 client-depl-7f4949498c-pdc8j                 500m (6%)     1 (12%)     512Mi (13%)      1Gi (26%)      7m32s
  tickets-app                 expiration-depl-57f97c5f67-f94dh             500m (6%)     1 (12%)     512Mi (13%)      1Gi (26%)      7m32s
  tickets-app                 expiration-redis-depl-56c5cd8cf6-nmx8r       0 (0%)        0 (0%)      0 (0%)           0 (0%)         42m
  tickets-app                 mongo-app-depl-77d6f75958-gg5nb              0 (0%)        0 (0%)      0 (0%)           0 (0%)         42m
  tickets-app                 nats-depl-6468fdb94d-gz5v5                   0 (0%)        0 (0%)      0 (0%)           0 (0%)         42m
  tickets-app                 orders-depl-f845f9bbd-w6869                  500m (6%)     1 (12%)     512Mi (13%)      1Gi (26%)      42m
  tickets-app                 payments-depl-78dcdd4c46-lqqjk               500m (6%)     1 (12%)     512Mi (13%)      1Gi (26%)      7m30s
  tickets-app                 tickets-depl-7b8c8d7f6b-wznkg                500m (6%)     1 (12%)     512Mi (13%)      1Gi (26%)      42m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests      Limits
  --------           --------      ------
  cpu                4050m (50%)   6 (75%)
  memory             3602Mi (94%)  6484Mi (169%)
  ......
```
It will show how much resources used by pods and how much available for you to use.
