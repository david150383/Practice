## Let's use Secret and ConfigMap in stage1 project using config yaml file
Previously we created `secret` using `kubectl create secret ` command, but this is not best practice. We should create them using configuration yaml file, also currently we have hard code configuration like `MONGO_URI`, also `MONGO_URI` written in 4 pod template, so in future we need to update in 4 places if need, so better to use ConfigMap for this.

> [!NOTE]
> I have copied stage1 project yaml files into stage2 and will change them now for improvements


<span style="color:blue">Delete existing secrets</span>
```
kubectl delete secrets --all
```
**Output**

```
secret "jwt-secret" deleted from default namespace
secret "stripe-secret" deleted from default namespace
```

<span style="color:blue">Get list of secrets</span>
```
kubectl get secrets
```
**Output**
```
No resources found in default namespace.
```
<span style="color:blue">Sample yaml file for ConfigMap</span>
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-configuration
  namespace: default
data:
  Key:value
```
- `namespace: default` is not required, if you will not set, it will be default, so its just about how you can set different namespace

<span style="color:blue">Sample yaml file for secret</span>
```
apiVersion: v1
kind: Secret
metadata:
  name: my-app-secret
  namespace: default
type: Opaque
data:
  key: value
```

There is only 3 difference between Secret and ConfigMap yaml config
- `kind` : for secret it will be `Secret` and for ConfigMap it will be `ConfigMap`
- `type` : Only secret have this field, For standard application secrets (like usernames, passwords, or API keys), always use Opaque. Other specific types include kubernetes.io/tls (for certificates) and kubernetes.io/dockerconfigjson (for container registry credentials).

- `data` : in `ConfigMap` data is a simple string values, but in `Secret` data is for Base64 Encoded Text, if you want simple string in `Secret` then use `stringData` instead of `data`, see example below

```
apiVersion: v1
kind: Secret
metadata:
  name: minimal-secret 
type: Opaque           
stringData:
  username: admin
```
### Security Best Practice
Never commit plain text or Base64 encoded YAML secret files to public Git repositories. Base64 is only an encoding mechanism, not encryption, and can be decoded instantly by anyone who sees it.

### Let's create Secret as required for our project
<span style="color:blue">Encode your values in your terminal using the base64 command:</span>
```
printf '%s' "my_super_secret_key" | base64
# Output: bXlfc3VwZXJfc2VjcmV0X2tleQ==

printf '%s' "stripe_test_key_here" | base64
# Output: c3RyaXBlX3Rlc3Rfa2V5X2hlcmU=
```

<span style="color:blue">Create a file named `secret-encoded.yaml` in stage2 folder.</span>
```
apiVersion: v1
kind: Secret
metadata:
  name: my-app-secret
  namespace: default
type: Opaque
data:
  JWT_KEY: bXlfc3VwZXJfc2VjcmV0X2tleQ==
  STRIPE_KEY: c2tfdGVzdF9obmZyQW04ck9rcnlGRW5WMjNqamZGbHc=
```
<span style="color:blue">Apply `secret-encoded.yaml` file to create secret.</span>
```
cd stage2
kubectl apply -f secret-encoded.yaml
```
**Output**
```
secret/my-app-secret created
```

<span style="color:blue">Get list of secrets</span>
```
kubectl get secrets
```
**Output**
```
NAME            TYPE     DATA   AGE
my-app-secret   Opaque   2      33s
```
You may notice previously we have two secrets for JWT_KEY and STRIPE_KEY, but now we have created both using one config, so we will update existing deployment files and replace `jwt-secret` and `stripe-secret` with `my-app-secret`

<span style="color:blue">Let's see how we used secrets in payment deployment before:</span>


```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: payments
  template:
    metadata:
      labels:
        app: payments
    spec:
      containers:
        - name: payments
          image: ticketing-nats-payments-app:1.2
          env:
            - name: NATS_CLIENT_ID
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: NATS_URL
              value: "nats://nats-srv:4222"
            - name: NATS_CLUSTER_ID
              value: ticketing
            - name: MONGO_URI
              value: "mongodb://mongo-srv:27017/payments"
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
            - name: STRIPE_KEY
              valueFrom:
                secretKeyRef:
                  name: stripe-secret
                  key: STRIPE_KEY
```
- used `value` field when hard coded into deployment file, for example see `NATS_URL` above in env 
- used `valueFrom` field when read it from somewhere else, it can be from below three optionsfile field,
  - use `fieldRef` when get it from same deployment file, for example see `NATS_CLIENT_ID` above in env
  - use `secretKeyRef` when get it from `Secret`, for example see `STRIPE_KEY` above.
  - use `configMapKeyRef` when get it from `configMap`. we will do it later.

#### Other useful fieldRef values

| fieldPath | Description |
| --- | --- |
| `metadata.name` | Pod name |
| `metadata.namespace` | Namespace |
| `metadata.uid` | Pod unique ID |
| `metadata.labels['app']` | Specific Pod label |
| `metadata.annotations['key']` | Specific annotation |
| `status.podIP` | Pod IP |
| `spec.nodeName` | Node where Pod runs |
| `spec.serviceAccountName` | Service account |

### Let's create ConfigMap as required for our project

<span style="color:blue">Get list of existing configMap and delete if you have one already exist for your project</span>
```
kubectl get configmap
```
**Output**
```
NAME               DATA   AGE
kube-root-ca.crt   1      19d
```
This is kubenetes default configMap and we did not created it, so nothing to delete.

<span style="color:blue">Create a file named `common-config.yaml` in stage2 folder.</span>
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-configuration
  namespace: default
data:
  NATS_URL: "nats://nats-srv:4222"
  NATS_CLUSTER_ID: ticketing
  REDIS_HOST: expiration-redis-srv
  MONGO_URI_AUTH: "mongodb://mongo-srv:27017/auth"
  MONGO_URI_ORDERS: "mongodb://mongo-srv:27017/orders"
  MONGO_URI_PAYMENTS: "mongodb://mongo-srv:27017/payments"
  MONGO_URI_TICKETS: "mongodb://mongo-srv:27017/tickets"
```

<span style="color:blue">Apply `common-config.yaml` file to create configMap.</span>
```
cd stage2
kubectl apply -f common-config.yaml
```

<span style="color:blue">Get list of configMap</span>
```
kubectl get configmap
```
**Output**
```
NAME                DATA   AGE
app-configuration   4      3s
kube-root-ca.crt    1      19d
```
Now we have our `app-configuration` configMap created.

### Let's Update our deployment files (`tickets-depl.yaml`, `payments-depl.yaml`, `orders-depl.yaml`, `expiration-depl.yaml`, `auth-depl.yaml`) to use `my-app-secret` Secret and `app-configuration` ConfigMap
```
So below :
- name: NATS_URL
  value: "nats://nats-srv:4222"

Will change with:

- name: NATS_URL
  valueFrom:
    configMapKeyRef:
      name: app-configuration
      key: NATS_URL
```

### Let's apply configuration files and test application

> [!NOTE]
> ConfigMaps and Secrets must exist before the Deployment's Pods can successfully start using them.

#### The recommended order is:
1. Create ConfigMap.
2. Create Secret.
3. Apply Deployment.

#### What happens if ConfigMap or Secret doesn't exist?

| Resource | Result |
| --- | --- |
| ConfigMap missing, required reference | Pod cannot start successfully |
| Secret missing, required reference | Pod cannot start successfully |
| ConfigMap/Secret exists | Pod can start, assuming other requirements are met |

<span style="color:blue">First delete everything, So we will not face any issue</span>
```
cd stage2
kubectl delete -f .
```
<span style="color:blue">now apply configMap and after that secret</span>
```
kubectl apply -f common-config.yaml

kubectl apply -f secret-encoded.yaml
```

**DevOps tip:** In CI/CD pipelines, create or update ConfigMaps and Secrets before deploying application Deployments. This avoids unnecessary Pod startup failures.

<span style="color:blue">Now apply all remaining configurations.</span>
```
kubectl apply -f  .
```
**Output**
```
deployment.apps/auth-depl created
service/auth-srv created
deployment.apps/client-depl created
service/client-srv created
configmap/app-configuration unchanged
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
secret/my-app-secret unchanged
deployment.apps/tickets-depl created
service/tickets-srv created
```
Now instead of provide all remaining files name, used . (all files of current directory). As configMap and secret already applied and nothing changed now, so it will show unchanged. see above output.

#### port forward ingress controller as in our local pc port 80 used by apache
```
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
```

#### Open website and unit test
```
http://ticketing.test:8080
```