

## 3. Add a PodDisruptionBudget (PDB)

Because you're using `Recreate`, I strongly recommend a PDB.

It helps prevent too many tickets pods from being voluntarily disrupted simultaneously.

yaml

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

With two replicas:

- At least one pod should remain available during voluntary disruptions.
- VPA updater must respect the disruption budget when evicting pods.
- If another pod is unavailable, an eviction may be blocked until availability is restored.

A PDB does not protect against every type of failure, such as node crashes.

kubectl apply -f tickets-pdb.yaml



## Kubernetes Volumes
In Kubernetes, Volumes are used to persist data and share files between containers inside a Pod.

The important thing to understand is that containers are ephemeral. If a container crashes and Kubernetes recreates it, data stored inside its container filesystem can be lost.

Kubernetes Volumes solve this problem by providing storage that can exist independently of a container's filesystem.

### Types of Kubernetes Volumes

Some important volume types:

| Volume type                 | Purpose                                                      |
| --------------------------- | ------------------------------------------------------------ |
| emptyDir                    | Temporary storage shared by containers in a Pod              |
| hostPath                    | Mounts a directory from the Kubernetes node                  |
| persistentVolume (PV)       | Cluster storage resource                                     |
| persistentVolumeClaim (PVC) | Request for storage                                          |
| configMap                   | Mount configuration files                                    |
| secret                      | Mount sensitive configuration                                |
| nfs                         | Shared network filesystem                                    |
| CSI                         | Storage provided through Container Storage Interface drivers |


We already have detailed notes in `Powerpoint file` and `ChatGPT notes`

In real production server i use `S3` bucket for files storage and managed db service like `RDS` or `Mongo Atlas`, So volume for these problem is not useful here, But we have two volume type above `configMap` and `Secret`.

Forexample you have a `Apache` container which using `apache` image, This image already have some configuration set in `/etc/apache2/apache2.conf`. So using `configMap` or `secret` we can override these configuration without re build image.

- Use ConfigMap volumes when applications need configuration files.
- Use Secret volumes when applications need sensitive configuration files or certificates.
- Use environment variables when applications expect environment-based configuration.
- Use an external secret manager for sensitive production credentials when appropriate.

## Kubernetes StatefulSet
Previously we created Kind `deployment` which is actually stateless things, they don't store any state, when they re start they don't have anything to loose. 

A StatefulSet is a Kubernetes workload resource used to manage stateful applications that need stable identities, persistent storage, or predictable startup and shutdown ordering.
Examples of stateful applications:
- PostgreSQL
- MySQL
- MongoDB
- Redis (when persistence or stable identity is needed)
- Kafka
- Elasticsearch

yaml file for statefulset
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
......
```

StatefulSet supports multiple replicas, stable identities, and individual persistent storage, but it does NOT automatically synchronize data between replicas or provide read/write database functionality. We need to manage it differently. That's one of the biggest reasons teams prefer managed database services such as:
- AWS RDS
- AWS Aurora
- MongoDB Atlas
- Amazon ElastiCache

## Kubernetes on Cloud
There is two ways for manage Kubernetes on Cloud 
1. Create own cluster from scratch
For example you will create 6 linod server instances in linod cloud and create own kubenetes cluster from scratch, like install master process, install worker processes (kubectl, kube proxy), continer run time (docker). So you need to manage this, secure this and backup.
2. Managed kubernetes service.
Many cloud prover provide managed service for kubenetes, so you don't need to worry about any setup, its easy and fast. Like AWS EKS. You just need to tail how many worker nodes (VM) you need.

## Helm
### What is Helm
Helm is a `package manager` for kubernetes. Using this we can package YAML files and distribute them in public or private repositories.

### First Feature
For example you have a application in cluster, now you want to add `Elastic Stack` for logging. In this case you need to create `Stateful Set, configMap, secret, services` etc. You need to do some RND for how two setup it. Instead of this we can use already existing set of YAML configuration files created by someone else for this. Its like npm package. So we call these set of files `Helm Charts`. There is already some compplex configuration created by someonce and hosted publically for us to re use.

#### Helm Charts
- Its bundle of YAML files.
- We can create our own Helm charts with Helm
- Push them to some Helm repository to make it avaialable for others.
- You can download and use existing once.

#### Common Helm Charts
- Database Apps like Mongodb, Mysql, Elastic search
- Monitoring Apps like Promotheus.

#### How to get Helm Charts
- Search using `Helm search <keyword>` command
- Get it from public `Helm repositories`
- Helm Hub

There is also some `Private repositories` which maintain by company and share within organizations.

### Second Feature
Second feature is templating engine. In case of `Microservice` application sometime you have same deployment configuration files only few values are changed. So using helm you can define common blue print and dynamic values are replaced by placeholders. This is practical for CI/CD. In your build you can replace the values on the fly.

### Third Feature is Release Management
This is provided by helm setup.
Helm version 2 comes in two parts:
1. Helm Client (CLI)
2. Helm Server (Tiller)
When you deploy helm chart using `helm install <chartname>`, helm client send yaml files to Helm server that actually has to run in Kubenetes cluster. Then server execute this request to create components from this yaml files inside kubenetes cluster. So its store release history in server. when we change something and `helm upgrade <chartname>` it will not remove everthing and re create, instead it will apply changes in existing deploymentss. In case of upgrade goes wrong due to some YAML configuration files false or wrong, We can rollback using `helm rollback <chartname>`. All this is because of Tiller manage history. 

That's why in Helm 3 Tiller part removed.

#### Downside of Tiller
Tiller has too much power inside kubernetes cluster. It can create, update, delete components. Its have two much permissions. This make a big security Issue


### Another use case of helm features : same applications accross different environments
You can create your own application chart and deploy on `development, staging and production` environment cluster, no need separate YAML file for each environment.

### Helm Directory Structure
There is some changes in all helm versions. 
As of November 10, 2026, Helm 4 is the current stable major version. As per helm 4 directory structure will be as below:
```
product-service/
│
├── Chart.yaml
├── Chart.lock
├── values.yaml
├── values.schema.json
├── .helmignore
├── charts/
├── crds/
└── templates/
    ....
```

#### What does each file do?

| File/folder          | Responsibility                     |
| -------------------- | ---------------------------------- |
| `Chart.yaml`         | Chart metadata and version         |
| `values.yaml`        | Values for template files.         |
| `values.schema.json` | Validates values structure         |
| `.helmignore`        | Excludes files from packaging      |
| `charts/`            | Dependency charts                  |
| `crds/`              | Custom Resource Definitions        |
| `templates/`         | Kubernetes YAML templates          |
| `_helpers.tpl`       | Reusable template helpers          |
| `Chart.lock`         | Locks resolved dependency versions |
| `NOTES.txt`          | Displays post-install instructions |


#### 1. Chart.yaml
This defines your chart metadata.
```yaml
apiVersion: v2
name: product-service
description: ShopSphere Product Service
type: application
version: 1.0.0
appVersion: "1.0.0"
```
Important distinction:
- version: Helm chart version.
- appVersion: Version of your actual application.

#### 2. values.yaml
This is one of the most important files in Helm.

Instead of hardcoding configuration in Kubernetes YAML, you define configurable values here.
```yaml
replicaCount: 2

image:
  repository: nginx
  tag: "1.27"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  requests:
    cpu: 100m
    memory: 128Mi

  limits:
    cpu: 500m
    memory: 512Mi
```

You can override these values for different environments.

For example:
```
values.yaml
values-dev.yaml
values-staging.yaml
values-production.yaml
```

For example you set only `replicaCount` in above `dev, staging and production` values file. Now when you use `value-dev.yaml` it will override `values.yaml` and only change `replicaCount`. So here consider concept of Class inheritance.
After override we will get a .value object with default values and overrided values.


move above


### Some Known issues
#### 1. Port 80 used by apache (in this case http://ticketing.test will point to apache localhost port 80 and not show your website)

<span style="color:blue">Make sure port 80 not used by other like apache</span>
```
sudo lsof -i :80
Or
sudo ss -ltnp | grep ':80'
```
If the output shows apache2 or httpd, Apache is handling requests on port 80.

<span style="color:blue">Check how your Ingress Controller is exposed</span>
```
kubectl get ingress
kubectl get pods -A | grep -i ingress
kubectl get svc -A | grep -i ingress
```

You need to determine whether your NGINX Ingress Controller is accessible through localhost:80, a NodePort, or another port.

> [!NOTE]
> If port 80 is used by apache, you can fix it by two approach

##### Option A: Let NGINX Ingress use port 80
In this case you need to stop Apache
```
sudo systemctl stop apache2
sudo systemctl disable apache2
```
##### Option B: Keep Apache running and use 8080 for ingress
Port-forward service on different port, so in kubernates its on port 80 but outside it will be available on port 8080
```
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
```
Now you can open website using
```
http://ticketing.test:8080/
```

#### 2. ticket pod and ticket mongodb pod both working, but ticket container facing conneciton problem

This can be happen when ticket pod started before mongodb pod get started, just recreate ticket pod, there is different ways for doing this

* delete pod using k8s config file
```
kubectl delete -f tickets-depl.yaml
kubectl apply -f tickets-depl.yaml
```
As we deleted pod using k8s config file, we need to create it our self

* delete pod by pod name
First run below commnd to get ticket pod name 
```
kubectl get pods
```
Run below command for delete pod
```
kubectl delete pod tickets-depl-9d7c8744c-fhh57
```
Now we don't need to create pod ourself kubernetes will automatic create ticket pod because in deployment config we set 1 replica, so control panel will check and found no ticket pod running, so it will automatic get started.


#### 3. if you have used secretKeyRef in your yaml file but not create secret using kubecrl then pod running status will show CreateContainerConfigError

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=my_super_secret_key
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_h...
```

#### 4.  If you get some connection error between services like below, its means coredns not working proper in cluster
```
MongooseServerSelectionError: getaddrinfo EAI_AGAIN auth-mongo-srv at \_handleConnectionErrors
```
**Possible reason**
Your Docker Desktop Kubernetes cluster is broken or incomplete.

CoreDNS was not deployed (or got removed).

#### Fix (Docker Desktop)

Do this exactly:

1️⃣ Disable Kubernetes

Docker Desktop → Settings → Kubernetes
Uncheck Enable Kubernetes
Click Apply & Restart

2️⃣ Re-enable Kubernetes

Enable it again
Click Apply & Restart

Wait until it says:

Kubernetes is running

3️⃣ Verify CoreDNS Is Back

Run:

kubectl get pods -n kube-system

Now you should see:

coredns-xxxxx Running

4️⃣ Redeploy Your App
kubectl delete -f .
kubectl apply -f .

Then test inside pod:

kubectl exec -it <auth-pod> -- nslookup auth-mongo-srv

It should now resolve to a ClusterIP like:

10.x.x.x

🧠 Why This Happened

Sometimes Docker Desktop:

Fails to install DNS

Gets corrupted after sleep/restart

Loses CoreDNS during upgrade

It’s a known issue.

🚀 After Fix

Once CoreDNS is running:

Your existing connection string:

mongodb://auth-mongo-srv:27017/auth

Will work perfectly.

### Kubernetes Best Practices
- Always use a specific iamge tag or number otherwise latest use automatic 
- Manage Liveness probe : Always set this otherwise you may face issue like pod is working but application inside is not working. so when we set Liveness probe kubenetes automatic restart pod if something wrong in application. In this we should just check a health url or a script without any dependencies
- Manage Readiness probe : Always set this otherwise kubenetes forward traffic before pod/application start and ready for accept traffic. In this we should check all dependencies working, like application connect with db, message broker, redis etc.
- Use Resources to limit and allow CPU and Memory for each pod.
- don't use NodePort service for access cluster outside like in browser, instead use LoadBalancer service or Ingress controller.
- Set at least 2 pod as replica, because if set 1 and pod restart then application will down until it start, so set replica at least 2, if you will not set replica in pod it will be default 1
- always use at least 2 worker node, if you have a small application but still use at least 2 worker node (aws ec2 instance), because if you run all pods in one worker node then if something went wrong with node, application will be doen.
- always use labels, so pods will be group and manage
- Use namespace, by default we have default namespace, so using this we can isolate resources, like ecommerce namaspace for all ecommerce application pods etc. We can also set access rights as per namaspace.


1. Always define CPU and memory requests.
2. Set memory limits carefully to avoid `OOMKilled`.
3. Monitor actual resource usage using `kubectl top`.
4. Avoid setting CPU limits too low because they can cause CPU throttling.
5. Use a Vertical Pod Autoscaler (VPA) to help recommend resource requests.
6. Use a Horizontal Pod Autoscaler (HPA) to scale replicas based on CPU or memory utilization.


> [!NOTE]
> We have three options for check liveness, readiness 1. exec (execute a command script) 2. tcpSocket 3. httpGet (a url in applicaiton for just check)