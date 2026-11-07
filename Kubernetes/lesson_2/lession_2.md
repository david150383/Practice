
## Secret and ConfigMap
Both **ConfigMap** and **Secret** are Kubernetes objects used to provide configuration to applications running inside Pods. Environment variables like keys, secret, url etc.

The main difference:
- **ConfigMap**: Stores non-sensitive configuration.
- **Secret**: Stores sensitive configuration such as passwords, API keys, tokens, and certificates.

Instead of hardcoding configuration inside your Docker image or Kubernetes Deployment, you externalize it into these objects. Also its useful when we need configuration in multiple deployment (pods), like AWS Key in product and orders both services. So it reduce duplicacy. 

## Let's extend existing ticketing microservice project for explore more kubenetes features

### Initial steps
<span style="color:blue">Make sure you have created docker images for all services, just cd in service directory and run below command for each service</span>
```
docker build -f Dockerfile_prod -t ticketing-nats-auth-app:1.2 .
docker build -f Dockerfile_prod -t ticketing-nats-expiration-app:1.2 .
docker build -f Dockerfile_prod -t ticketing-nats-orders-app:1.2 .
docker build -f Dockerfile_prod -t ticketing-nats-payments-app:1.2 .
docker build -f Dockerfile_prod -t ticketing-nats-tickets-app:1.2 .
docker build -f Dockerfile_prod -t ticketing-nats-client-app:1.2 .
```

> [!NOTE]
> here i have used -f for pass dockerfile name because i have two dockerfiles, Dockerfile for dev and Dockerfile_prod for production

#### Code Location
/RND-repo/ticketing microservices/ticketing-jwt-nats-k8
#### Github Repo
https://github.com/rcky1100/ticketing-jwt-nats-k8

---

### Stage 1
This is copy of above repo infra/k8s, just one change instead of multiple instance of mongodb, I used only one instance, so created only one deployment file for mongodb and used same service in all, database is different for each service but only one mongodb instance.

### In this project we are using two secrets

<span style="color:blue">make sure you have created jwt and stripe secret otherwise you will get CreateContainerConfigError</span>
```
kubectl get secrets
```
<span style="color:blue">If output is empty or don't contain "jwt-secret or stripe-secret", Create it using below command</span>
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=my_super_secret_key
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=placeyourstripekeyhere
```

In `stage1` folder, We have created `deployment` and `service` for all, also used 3000 port for all backend services and port 80 for frontend.
Now as all running in same 3000 port so how it will work ?

We have created a ingress controller service `ingress-srv.yaml` which will forward request to required service according to configuration

in this we have set a host `ticketing.test`, So we need to do following steps for ingress controller.
#### 1. Make sure ingress contoller installed
```
kubectl get pods -n ingress-nginx
```
**If Output empty, Install it**

#### 2. This installs the official Kubernetes NGINX Ingress Controller.
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```
#### 3. Add host file entry as below
```
nano /etc/hosts
127.0.0.1 	ticketing.test
```

#### Apply kubernetes configuration 
<span style="color:blue">Now for start all pods and service, run below command</span>
```
cd stage1
kubectl apply -f .
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

<span style="color:blue">Now you can run get pods command to see pod running status</span>
```
kubectl get pods
```
**Output**
```
NAME                                     READY   STATUS              RESTARTS   AGE
auth-depl-7998bf6645-c4gqd               0/1     ContainerCreating   0          2s
client-depl-6f9c6f8946-cktdk             0/1     ContainerCreating   0          2s
expiration-depl-86b48798ff-swxdf         0/1     ContainerCreating   0          2s
expiration-redis-depl-56c5cd8cf6-fnvx7   0/1     ContainerCreating   0          2s
mongo-app-depl-77d6f75958-lclgr          0/1     ContainerCreating   0          2s
nats-depl-6468fdb94d-kbzmw               0/1     ContainerCreating   0          2s
orders-depl-5896dfc87f-kwx7g             0/1     ContainerCreating   0          1s
payments-depl-77db58984d-dvmgp           0/1     ContainerCreating   0          1s
tickets-depl-bcdd8d665-dtz4v             0/1     ContainerCreating   0          1s
```

<span style="color:blue">Run same command after few minutes</span>
```
NAME                                     READY   STATUS    RESTARTS      AGE
auth-depl-7998bf6645-c4gqd               1/1     Running   0             42s
client-depl-6f9c6f8946-cktdk             1/1     Running   0             42s
expiration-depl-86b48798ff-swxdf         1/1     Running   1 (37s ago)   42s
expiration-redis-depl-56c5cd8cf6-fnvx7   1/1     Running   0             42s
mongo-app-depl-77d6f75958-lclgr          1/1     Running   0             42s
nats-depl-6468fdb94d-kbzmw               1/1     Running   0             42s
orders-depl-5896dfc87f-kwx7g             1/1     Running   0             41s
payments-depl-77db58984d-dvmgp           1/1     Running   0             41s
tickets-depl-bcdd8d665-dtz4v             1/1     Running   0             41s
```
Now you can see all pods running, if there is any issue it will show in status

<span style="color:blue">Now you can run get services command to see all running services</span>
```
kubectl get svc
```
**Output**
```
NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)             AGE
auth-srv               ClusterIP   10.100.141.217   <none>        3000/TCP            110s
client-srv             ClusterIP   10.103.175.127   <none>        80/TCP              110s
expiration-redis-srv   ClusterIP   10.102.200.231   <none>        6379/TCP            110s
kubernetes             ClusterIP   10.96.0.1        <none>        443/TCP             18d
mongo-srv              ClusterIP   10.100.39.51     <none>        27017/TCP           110s
nats-srv               ClusterIP   10.103.187.222   <none>        4222/TCP,8222/TCP   110s
orders-srv             ClusterIP   10.109.61.173    <none>        3000/TCP            110s
payments-srv           ClusterIP   10.111.89.7      <none>        3000/TCP            110s
tickets-srv            ClusterIP   10.103.40.134    <none>        3000/TCP            109s
```

<span style="color:blue">Now open virtual host url in browser and see</span>
```
http://ticketing.test
```

---

### In case of port 80 used by apache or other (in this case http://ticketing.test will point to apache localhost port 80 and not show your website), 

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

<span style="color:blue">Once all work done and you want to free space from cluster or remove pods/services/deployment etc, run below command</span>
```
kubectl delete -f .
```
Above command will stop and remove all pods, services, deployment, replica-sets and free space

---

## Let's see some more commands

<span style="color:blue">start a pod (similar to run a docker image)</span>
```
kubectl apply -f auth-depl.yaml
```
<span style="color:blue">Access above pod in host browser</span>
```
kubectl port-forward service/auth-srv 3000:3000
```

<span style="color:blue">Open sh for selected pod simlar to docker exec</span>
```
kubectl exec -it auth-depl-77b894578b-nc5bx -- sh
```

<span style="color:blue">If you want pods to Restart just delete pod</span>
```
kubectl delete pod <pod_name>
```
<span style="color:blue">if you want to create new pod, like you have changed something in docker image then</span>
```
kubectl apply -f <depl_file_name>
```

> [!NOTE]
> if you changed something in code and re build image then you need to update tag otherwise kubectl apply will not use new image and nothing change


1️⃣ If you updated the Docker image tag

If you rebuilt your Docker image (for example: client-app:1.1):

Update your deployment YAML to use the new image:

containers:
  - name: client
    image: client-app:1.1


Apply the deployment:

kubectl apply -f client-depl.yaml


Kubernetes will automatically create a new pod with the updated image and terminate the old one.

2️⃣ If you kept the same image tag (e.g., client-app:1.0)

Kubernetes caches the image by default. You need to force it to pull the updated image.

Option 1: Change imagePullPolicy to Always in your deployment:

imagePullPolicy: Always


Then apply:

kubectl apply -f client-depl.yaml


Option 2: Delete the existing pod — Kubernetes will recreate it automatically:

kubectl delete pod <client-pod-name>



<span style="color:blue">This deletes all resources belonging to the built-in all resource category across all namespaces.</span>
```
kubectl delete all --all --all-namespaces
```
