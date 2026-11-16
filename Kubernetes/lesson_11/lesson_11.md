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

---

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

---

## Kubernetes on Cloud
There is two ways for manage Kubernetes on Cloud 
1. Create own cluster from scratch
For example you will create 6 linod server instances in linod cloud and create own kubenetes cluster from scratch, like install master process, install worker processes (kubectl, kube proxy), continer run time (docker). So you need to manage this, secure this and backup.
2. Managed kubernetes service.
Many cloud provider provide managed service for kubenetes, so you don't need to worry about any setup, its easy and fast. Like AWS EKS. You just need to tail how many worker nodes (VM) you need.

---

## Helm
### What is Helm
Helm is a `package manager` for kubernetes. Using this we can package YAML files and distribute them in public or private repositories.

### Features provided by Helm
#### 1. First Feature
For example you have a application in cluster, now you want to add `Elastic Stack` for logging. In this case you need to create `Stateful Set, configMap, secret, services` etc. You need to do some RND for how two setup it. Instead of this we can use already existing set of YAML configuration files created by someone else for this. Its like npm package. So we call these set of files `Helm Charts`. There is already some complex configuration created by someonce and hosted publically for us to re use.

##### Helm Charts
- Its bundle of YAML files.
- We can create our own Helm charts with Helm
- Push them to some Helm repository to make it avaialable for others.
- You can download and use existing once.

##### Common Helm Charts
- Database Apps like Mongodb, Mysql, Elastic search
- Monitoring Apps like Promotheus.

##### How to get Helm Charts
- Search using `Helm search <keyword>` command
- Get it from public `Helm repositories`
- Helm Hub

There is also some `Private repositories` which maintain by company and share within organizations.

#### 2. Second Feature
Second feature is templating engine. In case of `Microservice` application sometime you have same deployment configuration files only few values are changed. So using helm you can define common blue print and dynamic values are replaced by placeholders. This is practical for CI/CD. In your build you can replace the values on the fly.

#### 3. Third Feature is Release Management
This is provided by helm setup.
Helm version 2 comes in two parts:
1. Helm Client (CLI)
2. Helm Server (Tiller)
When you deploy helm chart using `helm install <chartname>`, helm client send yaml files to Helm server that actually has to run in Kubenetes cluster. Then server execute this request to create components from this yaml files inside kubenetes cluster. So its store release history in server. when we change something and `helm upgrade <chartname>` it will not remove everthing and re create, instead it will apply changes in existing deploymentss. In case of upgrade goes wrong due to some YAML configuration files false or wrong, We can rollback using `helm rollback <chartname>`. All this is because of Tiller manage history. 

That's why in Helm 3 Tiller part removed.

##### Downside of Tiller
Tiller has too much power inside kubernetes cluster. It can create, update, delete components. Its have two much permissions. This make a big security Issue


#### 4. Another use case of helm features : same applications accross different environments
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

### Let's use Helm first feature : use existing charts
Above we learn about `StatefulSet` which is complex for setup, so here we can use helm chart for use existing Stateful set, in our project we are using deployment for `mongodb` which is fine for local, but for production it should be a `managed service` like `RDS` or use a stateful set for mongodb so we did not loose database state.

You can notice right now whenever we re start mongodb pod, we loose data. 

#### Step 1: Make sure helm installed in your local pc
```
helm version
```

##### If not installed, Install it in Mac
```
brew install helm
```

#### Step 2: Seach for a helm chart exist for Mongodb
##### Option 1 : Artifacthub.com
Open : https://artifacthub.io/
Go to docs and filter by Kind Helm Charts, so now you can search any helm chart exists

##### Option 2: search in and find related github repo or page for that chart

We will use below which i found using Option 1
```
https://artifacthub.io/packages/helm/cloudpirates-mongodb/mongodb
```

#### Step 3: Create `mongo-values.yaml` file in stage8 folder
```
# Keep the existing service name
fullnameOverride: mongo-srv

# Single MongoDB instance
replicaCount: 1

# MongoDB image
image:
  repository: mongo
  tag: "8"
  pullPolicy: IfNotPresent

# Persistent database storage
persistence:
  enabled: true
  size: 5Gi
  accessMode: ReadWriteOnce

# Kubernetes resources
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 1Gi

# Internal Kubernetes service
service:
  type: ClusterIP
  port: 27017

auth:
  enabled: true
  rootUsername: admin
  rootPassword: mypassword
```
#### Step 4: Delete existing mongo deployment and service
```
kubectl delete deployment mongo-app-depl -n tickets-app
kubectl delete service mongo-srv -n tickets-app
```

#### Step 5: Delete `Deployment` from `stage8/deployments/mongo-depl.yaml` configuration file as now we have `StatefulSet`, but we need to keep `ClusterIP` service as we need to connect. also update service selector
```
....
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/instance: mongo-srv
    app.kubernetes.io/name: mongodb
....
```

This means:
- app.kubernetes.io/instance: mongo-srv identifies your MongoDB Helm release.
- app.kubernetes.io/name: mongodb identifies the MongoDB application.

Both labels must match for a pod to be selected.

#### Step 6:  Update `common-config.yaml` configMap file
Above in `mongo-values.yaml` file we set mongodb username and password, so we need to update connection string
```
MONGO_URI_AUTH: "mongodb://admin:mypassword@mongo-srv:27017/auth?authSource=admin"
MONGO_URI_ORDERS: "mongodb://admin:mypassword@mongo-srv:27017/orders?authSource=admin"
MONGO_URI_PAYMENTS: "mongodb://admin:mypassword@mongo-srv:27017/payments?authSource=admin"
MONGO_URI_TICKETS: "mongodb://admin:mypassword@mongo-srv:27017/tickets?authSource=admin"
```

> [!NOTE]
> For a real project, store the password in a Kubernetes Secret rather than committing it to Git. The chart also supports an existing Secret. For now i skip this because we need to update all services code and re create image, because instaed or `MONGO_URI_`, We should pass multiple env variables, like `MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT`

#### Step 7:  Install the chart:

Run below command in stage8 folder:

```
helm install mongo-srv \
  oci://registry-1.docker.io/cloudpirates/mongodb \
  --namespace tickets-app \
  --version 0.18.12 \
  -f mongo-values.yaml
```
**Output**
```
Pulled: registry-1.docker.io/cloudpirates/mongodb:0.18.12
Digest: sha256:fd80547d06709d3a3a59e60048a98eb6c9179081b8322e8c4bfef05442ac5aa8
I1115 21:04:01.595614   33065 warnings.go:107] "Warning: spec.SessionAffinity is ignored for headless services"
NAME: mongo-srv
LAST DEPLOYED: Sun Nov 15 21:04:01 2026
NAMESPACE: tickets-app
STATUS: deployed
REVISION: 1
DESCRIPTION: Install complete
TEST SUITE: None
```

#### Step 8: Verify installation
```
helm list -n tickets-app
```
**Output**
```
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART             APP VERSION
mongo-srv       tickets-app     1               2026-11-15 21:04:01.425606 +0530 IST    deployed        mongodb-0.18.12   8.3.8       
```

See all related to tickets-app namespace:
```
kubectl get all -n tickets-app
kubectl get pvc -n tickets-app
```

I notice mongodb pod is in pending stat
```
kubectl get pods -n tickets-app | grep mongo 
``` 
**Output**
```
mongo-srv-0                              0/1     Pending   0             20h
```

Its because we are running it on local cluster, right now we have Insufficient memory, so we need to reduce memory Request

<span style="color:blue">First delete all deployments</span>
```
kubectl delete -f deployments
```

<span style="color:blue">Update all deployment configuration files to reduce memory and cpu request</span>
```
requests:
  cpu: "500m"
  memory: "512Mi"
limits:
  cpu: "1"
  memory: "1Gi"
```
to:
```
requests:
  cpu: "100m"
  memory: "128Mi"
limits:
  cpu: "200m"
  memory: "256Mi"
```

<span style="color:blue">Apply configMap and deployments</span>

```
kubectl apply  -f configmaps
kubectl apply  -f deployments
```

#### Step 9: Test application

##### port forward ingress controller as in our local pc port 80 used by apache
```
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
```

##### Open website and unit test
```
http://ticketing.test:8080
```