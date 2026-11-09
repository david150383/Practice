

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

> [!NOTE]
> We have three options for check liveness, readiness 1. exec (execute a command script) 2. tcpSocket 3. httpGet (a url in applicaiton for just check)