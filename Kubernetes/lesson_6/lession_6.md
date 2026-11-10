## Kubernetes Namespaces

A Namespace in Kubernetes is a logical way to divide and organize resources inside a Kubernetes cluster.

> [!NOTE]
> I have copied stage4 project yaml files into stage5 and will change them now for improvements

Think of a Kubernetes cluster as a single building, and namespaces as separate departments or rooms inside that building.

Each department can have its own:
- Deployments
- Pods
- Services
- ConfigMaps
- Secrets
- Resource quotas
- Network policies

The important point: namespaces allow multiple applications, teams, or environments to share the same Kubernetes cluster while keeping their resources logically separated.

### Check existing namespaces
```
kubectl get namespaces
```
Or:

```
kubectl get ns
```
**Output**
```
NAME              STATUS   AGE
default           Active   20d
kube-node-lease   Active   20d
kube-public       Active   20d
kube-system       Active   20d
```

Some important built-in namespaces:

| Namespace         | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `default`         | Default location for resources when no namespace is specified |
| `kube-system`     | Kubernetes system components                                  |
| `kube-public`     | Publicly readable cluster information                         |
| `kube-node-lease` | Node heartbeat leases                                         |

Other than `default`, we should not do anything with above namespaces. 

According to **official documentation** of Kubenetes you should not use Namespace if you have small project upto 10 users.

### Why we need namespaces
#### 1. Resources grouped in Namespaces

You may have multiple `deployments`, `services`, `configmap`, `secrets` etc. Over the time if you use `default` namespace it will not be organize and defficult to manage. So putting everything in one Namespace is not good.
Instead we can group them by type like **Mysql, PostgreSQL, Redis** in `databases` namespace, **prometheus, grafana, loki** in `monitoring` namespace, **Elasticsearch, Kibana, Logstash** in`Elastic Stack` namespace.

#### 2. Conflicts: Many teams, same application
In case of Many teams working on same cluster but different application, like team 1 has deployment called `my-app` and now team 2 created deployment with same name but different configuration for their application, so it will conflict and team 1 deployment override. 
So they can create seperate namespace like `project1` namaspece for team 1 and `project2` namespace for team 2.

#### 3. Resource Sharing: Development, Staging
In case you want to host both development and staging in single cluster for `cost optimization`. Also you can re use some components in both environment. So we don't need to create `Elastic Stack` or ``ngnix-ingres controller` for both `development` and `staging`. So we can re use common resources and don't need to create twice.

##### Blue/Green deployment.
In case you have two different versions of production. Like `Production Blue` which is active now and `Production Green` which will be next produciton after all testing. Both can have single `Elastic Stack` or `ngnix-ingres controller` component and re-use that. 

#### 4. Access and Resource Limits on Namespaces
In case two or more team working in same cluster. like `Project 1` namespace and `Project 2` namespace. You may don't want to grant access for Project 2 for team 1. So team can only do changes in their own namaspace resources. Also we can limit resources like CPU, Memory, Storage as per Namespace. So we can define `Resource Quota` per Namaspace.

### Create your own namespace using create command
<span style="color:blue">Let's create three namespaces:</span>
```
kubectl create namespace development
```
<span style="color:blue">Verify:</span>
```
kubectl get ns
```
**Output**
```
NAME              STATUS   AGE
default           Active   20d
development       Active   89s
kube-node-lease   Active   20d
kube-public       Active   20d
kube-system       Active   20d
```

### Deploy an application inside a namespace
You can specify a namespace using `-n` or `--namespace`.

<span style="color:blue">For example, deploy Nginx into development:</span>
```
kubectl create deployment nginx \
  --image=nginx:latest \
  -n development
```

<span style="color:blue">Check pods of development namespace only:</span>

```
kubectl get pods -n development
```
**Output**
```
NAME                     READY   STATUS    RESTARTS   AGE
nginx-7c5d8bf9f7-5wx88   1/1     Running   0          2m49s
```

<span style="color:blue">Check pods in all namespaces:</span>
```
kubectl get pods -A
```

Or:

```
kubectl get pods --all-namespaces
```

**Output**
```
NAMESPACE       NAME                                        READY   STATUS    RESTARTS         AGE
default         auth-depl-c644d7f5d-d492m                   1/1     Running   0                4h15m
default         client-depl-54b849fbfc-2x9zp                1/1     Running   0                4h15m
default         expiration-depl-7486749cd5-k6tth            1/1     Running   2 (4h15m ago)    4h15m
default         expiration-redis-depl-56c5cd8cf6-bzmzw      1/1     Running   0                4h15m
default         mongo-app-depl-77d6f75958-gqtl4             1/1     Running   0                4h15m
default         nats-depl-6468fdb94d-rq5kv                  1/1     Running   0                4h15m
default         orders-depl-f777479d6-rclhk                 1/1     Running   0                4h15m
default         payments-depl-5dbb46f96-kvb2d               1/1     Running   0                4h15m
default         tickets-depl-6f956b9c76-smvmj               1/1     Running   0                4h15m
development     nginx-7c5d8bf9f7-5wx88                      1/1     Running   0                3m47s
kube-system     coredns-66bc5c9577-gpmq9                    1/1     Running   16 (20h ago)     20d
kube-system     coredns-66bc5c9577-zgq2n                    1/1     Running   16 (20h ago)     20d
kube-system     etcd-docker-desktop                         1/1     Running   17 (20h ago)     20d
kube-system     kube-apiserver-docker-desktop               1/1     Running   17 (20h ago)     20d
kube-system     kube-controller-manager-docker-desktop      1/1     Running   18 (20h ago)     20d
kube-system     kube-proxy-gsl42                            1/1     Running   16 (20h ago)     20d
kube-system     kube-scheduler-docker-desktop               1/1     Running   24 (20h ago)     20d
kube-system     storage-provisioner                         1/1     Running   34 (4h26m ago)   20d
kube-system     vpnkit-controller                           1/1     Running   16 (20h ago)     20d
```
You may notice previously when we run `kubectl get pods`, its show only pods of default namaspaces.

**Important:** If you don't specify a namespace, Kubernetes uses `default` (unless your current context has a different namespace configured).

### 1. Namespace isolation and communication

One important concept: resources in different namespaces can have the same name.

For example:

```
development:
    nginx
    auth-service
    product-service

production:
    nginx
    auth-service
    product-service
```

Both namespaces can have a Deployment called `nginx`.

However, namespaces do not automatically provide complete security isolation. Use RBAC and NetworkPolicies when you need access restrictions.

#### Service-to-service communication

Kubernetes provides DNS-based service discovery.

Suppose you have:

```
development:
    auth-service
    product-service

production:
    auth-service
    product-service
```

From a pod in the development namespace:

```
curl http://auth-service
```

This resolves to the development namespace's `auth-service`.

To access the production service explicitly:

```
curl http://auth-service.production.svc.cluster.local
```

The standard DNS format is:

```
<service-name>.<namespace>.svc.cluster.local
```

### 2. Resource Quotas per namespace

Namespaces also allow administrators to control how much CPU, memory, and how many resources a team can consume.

For example, create `development-quota.yaml`:

```
apiVersion: v1
kind: ResourceQuota

metadata:
  name: development-quota
  namespace: development

spec:
  hard:
    requests.cpu: "2"
    requests.memory: 4Gi
    limits.cpu: "4"
    limits.memory: 8Gi
    pods: "10"
```

Apply:

```
kubectl apply -f development-quota.yaml
```

Check:

```
kubectl describe quota development-quota -n development
```

Now Kubernetes enforces these resource limits across the namespace.

### 3. Switch your default namespace

Instead of specifying `-n development` every time, you can change your current context's default namespace.

```
kubectl config set-context --current --namespace=development
```

Now:

```
kubectl get pods
kubectl get deployments
```

These commands automatically operate in `development`.

Check current context:

```
kubectl config view --minify
```

Switch back:

```
kubectl config set-context --current --namespace=default
```

### 4. Useful namespace commands cheat sheet

| Command                                                | Purpose                                       |
| ------------------------------------------------------ | --------------------------------------------- |
| `kubectl get ns`                                       | List namespaces                               |
| `kubectl create ns dev`                                | Create namespace                              |
| `kubectl describe ns dev`                              | Namespace details                             |
| `kubectl get pods -n dev`                              | List namespace pods                           |
| `kubectl get all -n dev`                               | List common resources                         |
| `kubectl get pods -A`                                  | List pods across namespaces                   |
| `kubectl delete ns dev`                                | Delete namespace and its namespaced resources |
| `kubectl get all -A`                                   | List everything in all namespaces             |
| `kubectl config set-context --current --namespace=dev` | Set default namespace                         |

### 5. Define namespace inside YAML

You can also specify a namespace in your Kubernetes manifest.

Example: `nginx-deployment.yaml`

```
apiVersion: apps/v1
kind: Deployment

metadata:
  name: nginx
  namespace: development

spec:
  replicas: 2
...
```

**Notice:**

```
metadata:
  namespace: development
```

This tells Kubernetes where to create the resource. Make sure you have created `development` namespace before apply configuration file otherwise you will get `namespace development not found` error.

### 6. Components, which can not be created within a Namespace
There is some resources which live `Globally` in Cluster. So we can not Isolate them in namespace. These are `volume`, `node` etc. You can see list of that resources in by running below command.
```
 kubectl api-resources --namespaced=false
```

### Let's see how we can update our stage5 configuration files to use namespace.

First delete everything exists in cluster created by us in default namespace.
```
kubectl delete all,secret,configmap --all -n default
kubectl delete ingress ingress-service -n default
```
Now there is two ways to create resource within a namespace
- Provide namaspace name when executing apply command with configuration yaml files.
- Provide namaspace field in each yaml file.

#### 1. Provide namaspace name when executing apply command with configuration yaml files.
For this first we need to create namespace otherwise we will get `Error from server (NotFound):`
<span style="color:blue">Create `my-app` namespace using create command</span>
```
kubectl create namespace my-app
```

<span style="color:blue">Provide namespace name using `--namespace` while running apply command</span>
```
kubectl apply -f deployments/ --namespace=my-app
```
**Output**
```
deployment.apps/auth-depl created
service/auth-srv created
deployment.apps/client-depl created
service/client-srv created
deployment.apps/expiration-depl created
deployment.apps/expiration-redis-depl created
service/expiration-redis-srv created
ingress.networking.k8s.io/ingress-service created
deployment.apps/mongo-app-depl created
service/mongo-srv created
deployment.apps/nats-depl created
service/nats-srv created
deployment.apps/orders-depl created
service/orders-srv created
deployment.apps/payments-depl created
service/payments-srv created
deployment.apps/tickets-depl created
service/tickets-srv created
```
> [!NOTE]
> Above command work fine when we execute for deployments, but if we will run this for configMaps or Secret, It will return error, because in configMap or Secret files, We added namespace default.

```
kubectl apply -f configmaps/ --namespace=my-app
```
**Output**
```
the namespace from the provided object "default" does not match the namespace "my-app". You must pass '--namespace=default' to perform this operation.
the namespace from the provided object "default" does not match the namespace "my-app". You must pass '--namespace=default' to perform this operation.
the namespace from the provided object "default" does not match the namespace "my-app". You must pass '--namespace=default' to perform this operation.
```
See above, We get error.

<span style="color:blue">As now we created deployments with `my-app` namespace, Without -n we will get default namespace things</span>
```
kubectl get pods
```
**Output**
```
No resources found in default namespace.
```
<span style="color:blue">Get pods list in `my-app` namespace</span>
```
kubectl get pods -n my-app
```
**Output**
```
NAME                                     READY   STATUS                       RESTARTS   AGE
auth-depl-c644d7f5d-76tc2                0/1     CreateContainerConfigError   0          4m1s
client-depl-54b849fbfc-l97b8             1/1     Running                      0          4m1s
expiration-depl-7486749cd5-wxhz9         0/1     CreateContainerConfigError   0          4m1s
expiration-redis-depl-56c5cd8cf6-jdb9q   1/1     Running                      0          4m1s
mongo-app-depl-77d6f75958-x4x7q          1/1     Running                      0          4m1s
nats-depl-6468fdb94d-cvw6h               1/1     Running                      0          4m1s
orders-depl-f777479d6-m6tc6              0/1     CreateContainerConfigError   0          4m1s
payments-depl-5dbb46f96-f7z6q            0/1     CreateContainerConfigError   0          4m1s
tickets-depl-6f956b9c76-558l8            0/1     CreateContainerConfigError   0          4m1s
```
**Notice:** Above few pods Status has error, its because we did not created configMap and Secret which required to create before start deployments.

<span style="color:blue">Let's create `configMaps` and `Secrets`, Then delete deployments and Re Create</span>

```
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl delete -f deployments/ --namespace=my-app
kubectl apply -f deployments/ --namespace=my-app
```

<span style="color:blue">Let's see issue resolve or not</span>
```
kubectl get pods -n my-app
```
**Output**
```
NAME                                     READY   STATUS                       RESTARTS   AGE
auth-depl-c644d7f5d-9g2hc                0/1     CreateContainerConfigError   0          17s
client-depl-54b849fbfc-qxvbv             0/1     Running                      0          17s
....
```
**Notice:** Still have issue, because we created `ConfigMap` and `Secrets` in default namespace which not accessible in `my-app`, So `ConfigMap` and `Secret` should be in same namespace.

Now to fix this we need to update `configMap` and `Secrets` yaml files to remove namespace field.

#### 2. Provide namaspace field in each yaml file.
<span style="color:blue">First delete whatever we created in `my-app` namespace</span>
```
kubectl delete namespace my-app
```
**Notice:** Instead delete resources one by one, we can delete namespace. Deleting the namespace itself will automatically delete every single resource contained inside it.
<span style="color:blue">Get list of namespaces to configm</span>
```
kubectl get ns  
```
**Output**
```
NAME              STATUS   AGE
default           Active   21d
kube-node-lease   Active   21d
kube-public       Active   21d
kube-system       Active   21d
```

<span style="color:blue">Create `tickets-app` namespace using create command</span>
```
kubectl create namespace tickets-app
```
<span style="color:blue">Update all configuration yaml files to add/update `namespace: tickets-app` after name in `metadata`</span>
Make sure to update all Objects in files. Means in most files we have created configuration for `Deployment` and `Service` in one file. Just separated using --- 

In a YAML file, --- is the Document Separator (also known as the directives end marker). It tells the YAML parser that a new, completely separate document or object is starting within the same file.
```yaml
....
kind: Deployment
metadata:
  name: tickets-depl
  namespace: tickets-app
....
---
apiVersion: v1
kind: Service
metadata:
  name: tickets-srv
  namespace: tickets-app
spec:
....  
```

<span style="color:blue">Apply configuration files to create resources</span>
```
cd stage5
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f deployments/
```

<span style="color:blue">Let's see everthing at once exists in `tickets-app` namespace</span>
```
kubectl get all -n tickets-app  
```
   
**Output**
``` 
NAME                                         READY   STATUS    RESTARTS      AGE
pod/auth-depl-c644d7f5d-hr226                1/1     Running   0             88s
pod/client-depl-54b849fbfc-756p4             1/1     Running   0             88s
......

NAME                           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)             AGE
service/auth-srv               ClusterIP   10.103.29.55     <none>        3000/TCP            89s
service/client-srv             ClusterIP   10.99.251.243    <none>        80/TCP              88s
......

NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/auth-depl               1/1     1            1           89s
deployment.apps/client-depl             1/1     1            1           88s
......

NAME                                               DESIRED   CURRENT   READY   AGE
replicaset.apps/auth-depl-c644d7f5d                1         1         1       89s
replicaset.apps/client-depl-54b849fbfc             1         1         1       88s
......
```

**Notice:** Still we don't have `configMap` and `Secrets` in above list, its because Kubernetes excludes Secrets and ConfigMaps by default to prevent sensitive data or massive configuration dumps from accidentally cluttering your terminal output when doing a quick health check

<span style="color:blue">Run below command to see everthing at once exists in `tickets-app` namespace including configmap and secret</span>

```
kubectl get all,configmap,secret -n tickets-app
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
> [!NOTE]
> In case of approach one if forgot to provide namespace, it will be created in default or active namespace.
> So second approach of using namespace is better.
> 1. because when we run apply command we don't need to provide namespace name.
> 2. better documented, we can see in files which resource belongs to which namespace.


<span style="color:blue">In case you don't want to use -n every time running other commands like `kubectl get pods` etc for get pods in `tickets-app` namespace, We can switch current namespace from `default` to `tickets-app` namespace by running below command</span>
```
kubectl config set-context --current --namespace=tickets-app
```
**Output**
```
Context "docker-desktop" modified.
```

<span style="color:blue">Get pods list without specify `tickets-app` namespace.</span>
```
kubectl get pods
```
**Output**
```                                        
NAME                                     READY   STATUS    RESTARTS      AGE
auth-depl-c644d7f5d-hr226                1/1     Running   0             49m
client-depl-54b849fbfc-756p4             1/1     Running   0             49m
expiration-depl-7486749cd5-rsr7b         1/1     Running   1 (49m ago)   49m
expiration-redis-depl-56c5cd8cf6-l4kv8   1/1     Running   0             49m
mongo-app-depl-77d6f75958-lvnpj          1/1     Running   0             49m
nats-depl-6468fdb94d-jj67x               1/1     Running   0             49m
orders-depl-f777479d6-4rmv8              1/1     Running   0             49m
payments-depl-5dbb46f96-gshjw            1/1     Running   0             49m
tickets-depl-6f956b9c76-xwhlz            1/1     Running   0             49m
```

<span style="color:blue">Change current active namespace back to `default`. Because may be we forgot this.</span>
```
kubectl config set-context --current --namespace=default
```