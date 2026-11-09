## Let's fix previous nats connection issue

In Kubernetes, `Liveness, Readiness, and Startup probes` are health checks used to monitor containers and determine whether an application is healthy, ready to receive traffic, or still starting.

> [!NOTE]
> I have copied stage3 project yaml files into stage4 and will change them now for improvements

They solve three different problems.

### 1. Liveness Probe – Is my application alive?

A Liveness Probe checks whether your application is still running properly.

If the probe fails repeatedly, Kubernetes restarts the container.

For example:

- Your Node.js application becomes deadlocked.
- The container is still running.
- But the application is no longer responding.

Kubernetes detects the failure and restarts the container.

yaml

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  timeoutSeconds: 2
  periodSeconds: 5
  failureThreshold: 3
  successThreshold: 1
```

Meaning:

- `initialDelaySeconds:` Wait 10 seconds before the first probe.
- `timeoutSeconds:` It waits up to 2 seconds for a response.
- `periodSeconds:` Check every 5 seconds.
- `failureThreshold:`If 3 consecutive checks fail, restart the container.
- `successThreshold:` Consecutive successful checks before marking the Pod live/ready.

> [!NOTE]
> In liveness and Startup, `successThreshold` should be always 1. Because if it success once means its live or start then check readyness. In Readiness it can be more than 1 for example `successThreshold: 3` means kubernetes will check 3 continue check and if all 3 attempt success then it will mark ready. 

Action: Restart container

#### Default probe configuration

| Setting | Default value |
| --- | --- |
| `initialDelaySeconds` | 0 |
| `periodSeconds` | 10 |
| `timeoutSeconds` | 1 |
| `successThreshold` | 1 |
| `failureThreshold` | 3 |
| `terminationGracePeriodSeconds` | Inherits Pod-level grace period |

### 2. Readiness Probe – Is my application ready to receive traffic?

A Readiness Probe checks whether your application is ready to handle incoming requests.

For example:

Imagine your application needs to:

- Start the Node.js server.
- Connect to MongoDB.
- Load application configuration.
- Initialize dependencies.

The container might be running, but the application isn't ready to process requests.

Kubernetes removes the Pod from the Service's available endpoints until it becomes ready.

yaml

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  timeoutSeconds: 2
  periodSeconds: 5
  failureThreshold: 3
```

If the readiness check fails:

- Container is NOT restarted.
- Pod becomes NotReady.
- Kubernetes stops sending normal Service traffic to that Pod.

Action: Stop routing traffic

### 3. Startup Probe – Has my application finished starting?

A Startup Probe is useful for applications that take a long time to start.

For example:

- Java Spring Boot applications.
- Applications performing database migrations.
- Applications loading large configurations.

Without a Startup Probe, Liveness Probe might fail while the application is still starting and unnecessarily restart it.

yaml

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  periodSeconds: 10
  failureThreshold: 30
```

Meaning:

- Check every 10 seconds.
- Allow up to 30 consecutive failures.
- So it will retry 30 times in gap of 10 seconds, Which gives the approximately 300 seconds to start application.
- If all 30 Startup Probe attempts fail, Kubernetes considers the container unhealthy and restarts it.
- Once it succeeds, Startup Probe is permanently considered successful for that container lifecycle. Now it will not execute until pod restart.
- AFter Startup Probe succeeds, Kubernetes starts executing Liveness and Readiness probes.

Action: Protect application startup

### 4. Difference between all three

| Feature | Liveness | Readiness | Startup |
| --- | --- | --- | --- |
| Purpose | Is app alive? | Is app ready? | Has app started? |
| Failure action | Restart container | Remove from Service endpoints | Wait, then restart if threshold exceeded |
| Checks startup? | After startup probe succeeds, if configured | After startup probe succeeds, if configured | Yes |
| Used for | Deadlocks | Dependency readiness | Slow startup |

### What should we change in our application code for this
We should have something in our application to let know kubernetes, its running and ready to take traffic.

##### I did following improvements in application code for handle proper Liveness and readiness probe :
1. Added health routes `/health/live` and `/health/ready` in all backend apis.
2. Updated backend apis for Graceful shutdown, so if mongodb or nats not available, it will shutdown and kubernetes will restart them.
3. Used ngnix in frontend image and added health route in `nginx.conf`, so we can use this route in kubenetes configuration for liveness and readiness
4. As expiration service was only for background, so there was no routes before, but added health routes for liveness and readiness, 
5. As expiration service was only for background and we need health routes only in kubenetes cluster, so not created kubenetes service for this, because service is only for external availability.

##### I added two `health` routes in all backend api services as below: 
```
const router = express.Router();

// Liveness probe
router.get("/api/tickets/health/live", (req, res) => {
  res.status(200).send({
    status: "OK",
  });
});

// Readiness probe
router.get("/api/tickets/health/ready", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  const natsConnected = natsWrapper.isConnected;

  const isReady = mongoConnected && natsConnected;

  res.status(isReady ? 200 : 503).send({
    status: isReady ? "READY" : "NOT READY",
    dependencies: {
      mongodb: mongoConnected ? "CONNECTED" : "DISCONNECTED",
      nats: natsConnected ? "CONNECTED" : "DISCONNECTED",
    },
  });
});
``` 

1. `/health/live` its just a route without anything in it just `200` status, Because if this route is accessible means application is running.

2. `/health/ready` in this we should check all dependencies working or not, like `mongodb` and `nats` both ready or not, in case of both ready we will return status `200` otherwise `503`.

### Recommended production configuration

| Setting | Startup | Readiness | Liveness |
| --- | --- | --- | --- |
| `initialDelaySeconds` | 0 | 0 | 0 |
| `periodSeconds` | 10 | 5 | 10 |
| `timeoutSeconds` | 5 | 2 | 2 |
| `failureThreshold` | 30 | 3 | 3 |
| `successThreshold` | 1 | 2 | 1 |

### Let's update our deployment files to use `Liveness, Readiness, and Startup probes` in pod template.


#### 1. updated `auth-depl.yaml` as below:

```yaml
...
image: ticketing-nats-auth-app:1.2
startupProbe:
  httpGet:
    path: /api/users/health/live
    port: 3000
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30

livenessProbe:
  httpGet:
    path: /api/users/health/live
    port: 3000
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/users/health/ready
    port: 3000
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 3
  successThreshold: 2
envFrom:
...
```

#### 2. updated `expiration-depl.yaml` as below:
```yaml
...
image: ticketing-nats-expiration-app:1.2
startupProbe:
  httpGet:
    path: /api/expiration/health/live
    port: 3004
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30

livenessProbe:
  httpGet:
    path: /api/expiration/health/live
    port: 3004
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/expiration/health/ready
    port: 3004
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 3
  successThreshold: 2
envFrom:
...
```

#### 3. updated `orders-depl.yaml` as below:
```yaml
...
image: ticketing-nats-orders-app:1.2
startupProbe:
  httpGet:
    path: /api/orders/health/live
    port: 3003
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30

livenessProbe:
  httpGet:
    path: /api/orders/health/live
    port: 3003
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/orders/health/ready
    port: 3003
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 3
  successThreshold: 2
envFrom:
...
```

#### 4. updated `payments-depl.yaml` as below:
```yaml
...
image: ticketing-nats-payments-app:1.2
startupProbe:
  httpGet:
    path: /api/payments/health/live
    port: 3002
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30

livenessProbe:
  httpGet:
    path: /api/payments/health/live
    port: 3002
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/payments/health/ready
    port: 3002
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 3
  successThreshold: 2
envFrom:
...
```

#### 5. updated `tickets-depl.yaml` as below:
```yaml
...
image: ticketing-nats-tickets-app:1.2
startupProbe:
  httpGet:
    path: /api/tickets/health/live
    port: 3001
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30

livenessProbe:
  httpGet:
    path: /api/tickets/health/live
    port: 3001
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/tickets/health/ready
    port: 3001
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 3
  successThreshold: 2
envFrom:
...
```

#### 6. updated `client-depl.yaml` as below:
```yaml
...
imagePullPolicy: IfNotPresent
startupProbe:
  httpGet:
    path: /health
    port: 80
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30

livenessProbe:
  httpGet:
    path: /health
    port: 80
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: 80
  periodSeconds: 5
  timeoutSeconds: 2
  failureThreshold: 3
  successThreshold: 2
---
...
```


### Let's apply configuration files and test application

<span style="color:blue">Apply configMap and after that secret</span>
```
cd stage4
kubectl apply -f configmaps/
```
**Output**
```
configmap/app-configuration created
configmap/nats-configuration created
configmap/redis-configuration created
```

```
kubectl apply -f secrets/
```
**Output**
```
secret/my-app-secret created
secret/my-stripe-secret created
```
<span style="color:blue">Now apply all deployments</span>
```
kubectl apply -f  deployments/
```

<span style="color:blue">Let's see all pods status</span>
```
kubectl get pods
```

**Output**
```
NAME                                     READY   STATUS    RESTARTS      AGE
auth-depl-c644d7f5d-lxd6b                1/1     Running   0             35s
client-depl-54b849fbfc-w7cgh             1/1     Running   0             35s
expiration-depl-7486749cd5-ckg7s         0/1     Running   2 (24s ago)   35s
expiration-redis-depl-56c5cd8cf6-j4jbl   1/1     Running   0             35s
mongo-app-depl-77d6f75958-mkfqs          1/1     Running   0             35s
nats-depl-6468fdb94d-vl6f8               1/1     Running   0             35s
orders-depl-f777479d6-gjgqx              0/1     Running   0             35s
payments-depl-5dbb46f96-6jhgw            0/1     Running   0             35s
tickets-depl-6f956b9c76-8m7pk            0/1     Running   0             35s
```
Now notice below things above
- I wait 35 seconds then did `kubectl get pods` that's why AGE is 35 Seconds
- expiration-depl RESTARTS twice to become in running status, but still not ready.
- you can notice some pods are still not ready but running.

Wait for few more seconds and check pods status again `kubectl get pods`, until they ready 

#### port forward ingress controller as in our local pc port 80 used by apache
```
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
```

#### Open website and unit test
```
http://ticketing.test:8080
```

## Other options for check `Liveness, Readiness, and Startup probes`
previously we used httpGet for check `Liveness, Readiness, and Startup probes` as our application is a web application. 
```yaml
httpGet:
  path: /api/users/health/live
  port: 3000
```

Kubernetes supports four probe mechanisms:

1. `httpGet` – HTTP request to an application endpoint.
2. `tcpSocket` – Check whether a TCP port is accepting connections.
3. `exec` – Execute a command inside the container.
4. `grpc` – Check application health through the gRPC Health Checking Protocol.

These mechanisms can be used with three probe types:

- Liveness – Should Kubernetes restart the container?
- Readiness – Should Kubernetes send traffic to the container?
- Startup – Has the application finished starting?

Let's look at all of them with production-oriented examples using Node.js.

## 1. `tcpSocket` probe

Checks whether a TCP connection can be established on a specified port.

When to use it:

- Applications that expose TCP services.
- Redis, PostgreSQL, RabbitMQ, or other TCP-based services.
- Applications where you don't have an HTTP health endpoint.

Example: PostgreSQL running on port `5432`.

```
apiVersion: v1
kind: Pod
metadata:
  name: postgres-tcp-check
spec:
  containers:
    - name: postgres
      image: postgres:16
      env:
        - name: POSTGRES_PASSWORD
          value: secret
      ports:
        - containerPort: 5432

      livenessProbe:
        tcpSocket:
          port: 5432
        initialDelaySeconds: 10
        periodSeconds: 10

      readinessProbe:
        tcpSocket:
          port: 5432
        initialDelaySeconds: 5
        periodSeconds: 5
```

How it works:

```
Kubernetes Kubelet
       |
       | TCP connection to port 5432
       |
       v
PostgreSQL container
       |
       +---- Connection successful -> Healthy
       |
       +---- Connection failed -----> Probe failed
```

Important: TCP only confirms that a port accepts connections. It doesn't verify that PostgreSQL can execute queries or that the database is accepting application transactions.

## 2. `exec` probe

Executes a command inside the container.

The command's exit code determines the result:

- Exit code `0` → Success.
- Non-zero exit code → Failure.

When to use it:

- Checking a file or process.
- Checking an application-specific condition.
- Checking a local resource without exposing an HTTP endpoint.

Example:

```
apiVersion: v1
kind: Pod
metadata:
  name: exec-health-check
spec:
  containers:
    - name: app
      image: busybox:1.36
      command:
        - /bin/sh
        - -c
        - |
          touch /tmp/healthy
          sleep 3600

      livenessProbe:
        exec:
          command:
            - cat
            - /tmp/healthy
        initialDelaySeconds: 5
        periodSeconds: 10
        failureThreshold: 3
```

Here, Kubernetes executes:

```
cat /tmp/healthy
```

As long as the file exists, the probe succeeds.

Let's simulate failure.

```
kubectl exec exec-health-check -- rm /tmp/healthy
```

Now the command returns a non-zero exit code.

After three consecutive failures, Kubernetes restarts the container.

Check:

```
kubectl describe pod exec-health-check
```

Look for:

```
Liveness probe failed
Container will be restarted
```

Note: This example deliberately uses BusyBox. Don't assume commands such as curl, bash, or ps exist in minimal production images.

## 3. `grpc` probe

This is useful when your application exposes a gRPC service and implements the standard gRPC Health Checking Protocol.

When to use it:

- gRPC microservices.
- Internal service-to-service communication.
- High-performance RPC applications.

For example, imagine an inventory service exposing:

```
inventory-service:50051
```

Your gRPC application implements the standard health service and reports `SERVING` when healthy.

Kubernetes configuration:

```
apiVersion: v1
kind: Pod
metadata:
  name: grpc-health-check
spec:
  containers:
    - name: inventory-service
      image: my-inventory-service:1.0.0
      ports:
        - containerPort: 50051

      livenessProbe:
        grpc:
          port: 50051
        initialDelaySeconds: 10
        periodSeconds: 10

      readinessProbe:
        grpc:
          port: 50051
        initialDelaySeconds: 5
        periodSeconds: 5
```

The application must implement the gRPC health checking service. Merely exposing port `50051` is not sufficient.

The health response should report:

```
SERVING
```

If it reports `NOT_SERVING`, Kubernetes considers the probe unsuccessful.

Important: Kubernetes native gRPC probes have some limitations:

- Port must be a numeric value.
- No named ports.
- No custom authentication parameters.
- The default connection is plaintext.

Native gRPC probes are stable from Kubernetes v1.27.

## 4. Comparison of all four mechanisms

| Mechanism   | What it checks       | Typical use              |
| ----------- | -------------------- | ------------------------ |
| `httpGet`   | HTTP response        | REST APIs                |
| `tcpSocket` | TCP connection       | Redis, PostgreSQL        |
| `exec`      | Command exit code    | Local process/file check |
| `grpc`      | gRPC health response | gRPC services            |

These four mechanisms can be used for all three probe types: liveness, readiness, and startup.