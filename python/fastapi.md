Since you already know Node.js, Express, NestJS, and backend development, these FastAPI interview questions focus on practical backend concepts, production scenarios, and Python-specific differences rather than beginner programming.

# FastAPI interview questions and answers

## 1. Core FastAPI concepts

### Q1. What is FastAPI, and why use it?

Answer: FastAPI is a Python web framework for building APIs. It uses Python type hints, Pydantic validation, and OpenAPI generation.

Key benefits:

- Automatic request validation and serialization.
- Automatic Swagger UI and ReDoc documentation.
- Support for `async`/`await`.
- Dependency injection through `Depends()`.
- Strong support for API contracts using OpenAPI schemas.

```
from fastapi import FastAPI

app = FastAPI()

@app.get("/products/{product_id}")
async def get_product(product_id: int):
    return {"product_id": product_id}
```

If a client sends `/products/abc`, FastAPI returns a validation error because `product_id` must be an integer.

Node.js comparison: FastAPI combines features that you might implement using Express/NestJS, validation libraries, and OpenAPI tooling.

### Q2. What is the difference between FastAPI, Flask, and Django?

| Feature              | FastAPI           | Flask                                       | Django                                         |
| -------------------- | ----------------- | ------------------------------------------- | ---------------------------------------------- |
| Primary focus        | APIs              | Lightweight web apps and APIs               | Full-featured web applications                 |
| Type-hint validation | Built-in          | Usually added separately                    | Usually added separately                       |
| API documentation    | Automatic OpenAPI | Extensions needed                           | Extensions needed                              |
| ORM                  | Choose your own   | Choose your own                             | Built-in Django ORM                            |
| Async support        | First-class       | Supported with limitations depending on use | Supported, with sync components still relevant |

Interview tip: Choose based on the architecture and requirements, not just benchmark results.

### Q3. Why does FastAPI use Python type hints?

Type hints describe expected values and allow FastAPI to validate and convert incoming data.

```
@app.get("/items")
async def list_items(
    limit: int = 10,
    active: bool = True
):
    return {"limit": limit, "active": active}
```

A request such as `/items?limit=20&active=false` is converted into the appropriate Python types.

Type hints also help with IDE support, static analysis, and generated API documentation.

### Q4. What is Pydantic?

Answer: Pydantic validates and parses data against Python models, using type annotations. FastAPI uses it extensively for request bodies and response schemas.

```
from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)
```

Use this model as the request body:

```
@app.post("/products")
async def create_product(product: ProductCreate):
    return product
```

Invalid data is rejected before the handler runs.

In production, use `Decimal` rather than floating-point numbers when precise monetary arithmetic is required.

### Q5. What is the difference between a path parameter, query parameter, and request body?

```
@app.get("/products/{product_id}")
async def get_product(
    product_id: int,
    include_reviews: bool = False
):
    return {
        "product_id": product_id,
        "include_reviews": include_reviews
    }
```

For `/products/10?include_reviews=true`:

- `product_id`: path parameter.
- `include_reviews`: query parameter.
- Request body: typically used for submitted data such as a product creation payload.

A common REST convention is to use `GET /products/10` to retrieve a product and `POST /products` with a JSON body to create one.

## 2. Async, concurrency, and performance

### Q6. What is the difference between `async def` and `def` in FastAPI?

Answer:

- `async def` defines a coroutine that can yield control while awaiting asynchronous operations.
- `def` defines a synchronous function. FastAPI runs ordinary synchronous path operations in an external thread pool rather than blocking the event loop directly.

```
@app.get("/async")
async def async_endpoint():
    result = await fetch_from_async_database()
    return {"result": result}

@app.get("/sync")
def sync_endpoint():
    result = fetch_from_sync_database()
    return {"result": result}
```

Use `async def` when the libraries you call support asynchronous I/O. Don't call blocking operations directly inside an async endpoint, or you can block the event loop.

### Q7. Does `async def` automatically make an API faster?

Answer: No. It enables efficient concurrency for I/O-bound workloads when the code cooperates with the event loop.

For example:

```
import asyncio

@app.get("/dashboard")
async def dashboard():
    products, orders = await asyncio.gather(
        fetch_products(),
        fetch_orders()
    )
    return {
        "products": products,
        "orders": orders
    }
```

If both operations are independent asynchronous I/O calls, they can overlap rather than waiting for each one sequentially.

For CPU-heavy calculations, `async` alone does not provide CPU parallelism.

### Q8. How does FastAPI handle multiple requests?

Answer: The behavior depends on the ASGI server configuration and the application code.

- An event loop can interleave many requests doing asynchronous I/O.
- Synchronous path operations can use a thread pool.
- Multiple worker processes can execute work in parallel across CPU cores.
- Multiple application replicas can scale the service across machines.

For example, Uvicorn can run an application with multiple worker processes:

```
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Each worker is a separate process, with its own application memory. In containerized production deployments, the appropriate number of workers depends on CPU and memory limits and the deployment architecture.

### Q9. How does Python's GIL affect FastAPI?

Answer: In traditional GIL-enabled CPython, multiple threads generally cannot execute Python bytecode in parallel within the same interpreter.

- Async I/O is useful for I/O-bound requests.
- Threads are useful for blocking I/O and libraries that release the GIL.
- Multiple processes can provide CPU parallelism.
- CPU-heavy work can also be delegated to a separate worker service.

Scenario: If a FastAPI endpoint performs expensive image processing, adding more `async` endpoints may not improve CPU throughput. A separate process pool or background worker may be more appropriate.

## 3. Dependency injection and API design

### Q10. What is `Depends()` in FastAPI?

Answer: `Depends()` declares a dependency that FastAPI resolves before calling your endpoint. Dependencies are commonly used for database sessions, authentication, authorization, and reusable query logic.

```
from fastapi import Depends, FastAPI

app = FastAPI()

def get_current_user():
    return {"id": 1, "role": "admin"}

@app.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    return {"user": user}
```

Output:

```
{
  "user": {
    "id": 1,
    "role": "admin"
  }
}
```

In a production application, `get_current_user()` should verify the user's credentials or token rather than return a hardcoded user.

Node.js comparison: Similar in purpose to dependency injection in NestJS, although FastAPI dependencies are resolved through function parameters and dependency declarations.

### Q11. What is `response_model`?

Answer: `response_model` defines the expected response schema. FastAPI validates and serializes the output against it and can exclude fields not included in the schema.

```
from pydantic import BaseModel

class UserResponse(BaseModel):
    id: int
    email: str

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    return {
        "id": user_id,
        "email": "user@example.com",
        "password_hash": "secret"
    }
```

The response contains only `id` and `email`.

Why it matters: It helps prevent accidental exposure of internal database fields. Sensitive information should also be protected at the service and data-access layers.

### Q12. How do you handle HTTP errors?

Answer: Use `HTTPException` for expected HTTP errors.

```
from fastapi import HTTPException

@app.get("/products/{product_id}")
async def get_product(product_id: int):
    product = None  # Example lookup

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product
```

The response has HTTP status `404` and a JSON error detail.

For larger applications, use centralized exception handlers to produce consistent error responses and avoid exposing stack traces to clients.

### Q13. What is `APIRouter`?

Answer: `APIRouter` organizes endpoints into modules, similar to separating routes by domain in Express or NestJS.

```
# routers/products.py
from fastapi import APIRouter

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
async def list_products():
    return [{"id": 1, "name": "Keyboard"}]
```

Register the router in the application:

```
from fastapi import FastAPI
from routers.products import router as products_router

app = FastAPI()
app.include_router(products_router, prefix="/api/v1")
```

The endpoint becomes `GET /api/v1/products/`.

This makes it easier to organize a larger application into modules such as authentication, products, orders, and payments.

## 4. Database and background processing

### Q14. How should you manage database sessions in FastAPI?

Answer: Create a dependency that opens a session for a request and reliably closes it afterward.

For example, using SQLAlchemy:

```
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Inject the session:

```
from fastapi import Depends
from sqlalchemy.orm import Session

@app.get("/products")
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
```

Production considerations:

- Configure connection pooling.
- Manage transactions explicitly where appropriate.
- Roll back failed transactions.
- Avoid sharing one session concurrently across unrelated requests or tasks.
- Use an appropriate async database stack if you need asynchronous database I/O.

### Q15. What are `BackgroundTasks`?

Answer: FastAPI's `BackgroundTasks` lets you run small tasks after the response has been sent.

```
from fastapi import BackgroundTasks

def write_audit_log(message: str):
    print(f"Audit: {message}")

@app.post("/orders")
async def create_order(background_tasks: BackgroundTasks):
    background_tasks.add_task(
        write_audit_log,
        "Order created"
    )
    return {"status": "created"}
```

This returns the response without waiting for the audit-log function to finish.

Important limitation: These tasks run in the application process. They are not a durable job queue. For critical tasks such as payment processing, reliable notifications, or long-running work, use a queue such as RabbitMQ or a managed task service with retries and failure handling.

### Q16. How would you prevent duplicate order creation?

Scenario: A client retries `POST /orders` after a network timeout. How do you avoid charging the customer twice or creating duplicate orders?

Answer: Implement idempotency.

1. Require an idempotency key for the operation.
2. Store the key with the operation's result and status.
3. Enforce uniqueness in the database.
4. Atomically coordinate the key, order creation, and state changes.
5. Return the previous result for a repeated request with the same key.

For payment operations, also use the payment provider's idempotency support where available. Do not rely solely on an in-memory dictionary because it will not work reliably across multiple workers or replicas.

## 5. Authentication and security

### Q17. How do you implement JWT authentication in FastAPI?

Answer: Use an established JWT library and FastAPI's security dependencies to extract and validate bearer tokens.

Typical flow:

1. Authenticate the user.
2. Issue a signed access token.
3. The client sends `Authorization: Bearer <token>`.
4. A dependency verifies the signature, permitted algorithm, expiry, issuer, and audience as appropriate.
5. Authorization logic checks the user's permissions.

JWT payloads are generally encoded, not encrypted. Do not put secrets in them.

For production systems, plan for token expiry, key rotation, refresh-token revocation, and authorization checks at the appropriate resource boundaries.

### Q18. What is the difference between authentication and authorization?

- Authentication: Who are you?
- Authorization: What are you allowed to do?

Example: a user successfully logs in, but only an administrator can delete another user's account.

Authentication does not automatically grant permission to perform every operation.

### Q19. What is CORS?

Answer: Cross-Origin Resource Sharing is a browser security mechanism that controls which origins can make certain cross-origin requests to your API.

```
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

Avoid allowing every origin in production when your application requires restricted access. CORS is not a replacement for authentication or authorization.

## 6. Middleware, lifecycle, and testing

### Q20. What is middleware in FastAPI?

Answer: Middleware runs around request processing. It can inspect a request before the endpoint and modify or observe the response afterward.

Common uses include request IDs, timing, security headers, and request/response instrumentation.

```
import time
from fastapi import Request

@app.middleware("http")
async def measure_request_time(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)

    response.headers["X-Process-Time"] = str(
        time.perf_counter() - start
    )

    return response
```

In production, ensure middleware doesn't log passwords, access tokens, or other sensitive data. Middleware ordering can also affect behavior.

### Q21. What is the lifespan of a FastAPI application?

Answer: Lifespan handlers manage startup and shutdown resources, such as database pools, HTTP clients, and model instances.

```
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initialize resources")
    yield
    print("Close resources")

app = FastAPI(lifespan=lifespan)
```

The code before `yield` runs during startup; the code after it runs during shutdown.

With multiple worker processes or replicas, each worker may initialize its own resources. Account for that when sizing connection pools and loading large models.

### Q22. How do you test FastAPI endpoints?

Answer: Use `pytest` and FastAPI's `TestClient` for HTTP-level tests.

```
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_product():
    response = client.get("/products/1")

    assert response.status_code == 200
```

This assumes the endpoint returns `200` for that request.

A production test strategy should include:

- Unit tests for business logic.
- API tests for status codes and schemas.
- Database integration tests.
- Authentication and authorization tests.
- Tests for validation failures and dependency overrides.
- End-to-end tests for critical workflows.

### Q23. How do you validate an API contract in CI?

Answer: FastAPI generates an OpenAPI schema, usually available at `/openapi.json`.

You can use it to generate clients, validate API documentation, compare schema changes, and detect breaking changes in CI.

A practical pipeline could:

1. Run linting and type checks.
2. Run unit and integration tests.
3. Generate the OpenAPI schema from the application.
4. Compare it with the committed contract or a baseline.
5. Fail on unintended breaking changes.

Be deliberate about schema generation: application startup dependencies and configuration must be available if your test or export process requires them.

## 7. Production scenario questions

| Interview question                                                     | Strong answer should mention                                                                                                                    |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| API response time suddenly increases. What do you check?               | Latency percentiles, traces, database query times, external API latency, connection pools, CPU and memory.                                      |
| Database connections are exhausted. How do you fix it?                 | Pool sizing, leaked sessions, transaction duration, worker count, database limits and backpressure.                                             |
| An endpoint must process 100,000 records. What approach would you use? | Pagination or streaming, bounded memory, batching, and a durable background worker if processing is long-running.                               |
| How do you deploy FastAPI on Kubernetes?                               | ASGI server, container image, readiness/liveness probes, resource requests/limits, graceful shutdown, secrets, and horizontal scaling.          |
| How do you handle rate limiting?                                       | Per-user or per-client limits, a shared store such as Redis where appropriate, clear `429` responses, and protection against distributed abuse. |
| How do you avoid blocking an async endpoint?                           | Use async-compatible I/O libraries, offload blocking work appropriately, and move heavy CPU tasks to worker processes or a separate service.    |
| How do you handle failures in distributed services?                    | Timeouts, bounded retries with backoff, idempotency, observability, and carefully applied circuit breakers.                                     |

## 8. Quick revision: Python and FastAPI

| Term              | What to remember                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `async def`       | Defines a coroutine function.                                                              |
| `await`           | Suspends a coroutine until an awaitable operation progresses or completes.                 |
| ASGI              | Interface between an async-capable Python web server and an application.                   |
| Uvicorn           | An ASGI server commonly used to run FastAPI.                                               |
| Pydantic          | Data validation and serialization using Python models and type annotations.                |
| `Depends()`       | Declares dependencies for FastAPI to resolve.                                              |
| `APIRouter`       | Organizes related routes into modules.                                                     |
| `response_model`  | Defines and validates the response schema.                                                 |
| `HTTPException`   | Raises an HTTP error response.                                                             |
| `BackgroundTasks` | Runs small in-process tasks after a response.                                              |
| `TestClient`      | Tests API requests without requiring a separately running server.                          |
| OpenAPI           | Machine-readable API description used for documentation, tooling, and contract validation. |

