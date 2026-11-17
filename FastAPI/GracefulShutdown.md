In FastAPI, you handle this using Lifespan Events.

The equivalent of Node.js application startup and graceful shutdown is FastAPI's `lifespan` mechanism.

You can use it to:

1. Connect to PostgreSQL/MongoDB during application startup.
2. Connect to NATS during application startup.
3. If any critical dependency is unavailable, fail startup.
4. Keep database and NATS connections available throughout the application lifetime.
5. Close all connections gracefully when the application shuts down.

This is actually a very clean way to manage infrastructure dependencies in FastAPI.

## 1. Understanding the lifecycle

## FastAPI application lifecycle

Application startup

Lifespan begins

Connect to database

Connect to NATS

ReadyAccept HTTP requests

Shutdown signal received

Close NATS and database connections

Application stopped

If the database or NATS connection fails during startup, the application should not reach the ready state.

## 2. Practical implementation with PostgreSQL and NATS

Let's build something similar to what you would do in Node.js.

For this example:

- PostgreSQL using `asyncpg`.
- NATS using `nats-py`.

Install:

bash

```bash
pip install fastapi uvicorn asyncpg nats-py
```

main.py

python

```python

import logging
from contextlib import asynccontextmanager

import asyncpg
import nats

from fastapi import FastAPI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):

    # Startup
    logger.info("Starting application...")

    try:
        # Connect to PostgreSQL
        app.state.db = await asyncpg.create_pool(
            "postgresql://postgres:password@localhost:5432/mydb"
        )

        # Verify database connection
        async with app.state.db.acquire() as conn:
            await conn.execute("SELECT 1")

        logger.info("PostgreSQL connected")

        # Connect to NATS
        app.state.nats = await nats.connect(
            "nats://localhost:4222",
            connect_timeout=3
        )

        logger.info("NATS connected")

    except Exception:
        logger.exception("Startup failed")

        # Clean up anything already initialized
        if hasattr(app.state, "nats"):
            await app.state.nats.close()

        if hasattr(app.state, "db"):
            await app.state.db.close()

        raise  # Fail application startup

    yield

    # Shutdown
    logger.info("Shutting down application...")

    try:
        if hasattr(app.state, "nats"):
            await app.state.nats.drain()
            await app.state.nats.close()

        if hasattr(app.state, "db"):
            await app.state.db.close()

        logger.info("All connections closed")

    except Exception:
        logger.exception("Error during shutdown")


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def home():
    return {"message": "Application is running"}
```

## 3. The most important part: `yield`

Understand this concept carefully.

python

```python
@asynccontextmanager
async def lifespan(app: FastAPI):

    # Everything before yield = STARTUP

    await connect_database()
    await connect_nats()

    yield

    # Everything after yield = SHUTDOWN

    await disconnect_nats()
    await disconnect_database()
```

Think of it like this:

| Python | Node.js equivalent |
| --- | --- |
| Before `yield` | Application initialization |
| `yield` | Application is running |
| After `yield` | Graceful shutdown |

If `connect_database()` throws an exception before `yield`, the application fails to start.

That's exactly what you want when the database is a mandatory dependency.

FastAPI recommends this lifespan approach over the older separate startup/shutdown event handlers.

FastAPI

+1

## 4. What happens if NATS is unavailable?

For example:

- PostgreSQL connects successfully.
- NATS is unavailable.
- `nats.connect()` throws an exception.
- The exception is logged.
- PostgreSQL's already-created pool is closed.
- The exception is re-raised.
- FastAPI startup fails.

Your application won't start accepting requests.

Expected behaviorThis is called a fail-fast startup strategy.

## 5. What about if DB or NATS goes down after startup?

This is a different scenario.

Lifespan only handles initial connection and cleanup. It does not automatically shut down your application if a dependency becomes unavailable later.

For production, I recommend:

- Startup checks: Ensure DB and NATS are available.
- Health checks: Monitor dependency availability.
- Reconnect logic: Let database/NATS clients recover where supported.
- Readiness endpoint: Tell Kubernetes or your load balancer whether the instance should receive traffic.
- Liveness endpoint: Tell the orchestrator whether the process itself is healthy.

For example:

python

```python
@app.get("/health/ready")
async def readiness():
    try:
        async with app.state.db.acquire() as conn:
            await conn.execute("SELECT 1")

        if app.state.nats.is_closed:
            raise RuntimeError("NATS disconnected")

        return {"status": "ready"}

    except Exception:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=503,
            detail="Service unavailable"
        )
```

This is a basic example; production NATS readiness should also account for connection state and whether the required subscriptions are established.

## 6. One important production recommendation

Don't confuse these three concepts:

| Concept | Responsibility |
| --- | --- |
| Lifespan | Initialize and clean up resources |
| Readiness | Can this instance handle requests? |
| Liveness | Is this process still functioning? |

If you're using Docker or Kubernetes, these concepts become especially important.

## Official documentation

- [FastAPI Lifespan Events](<https://fastapi.tiangolo.com/advanced/events/?utm_source=chatgpt.com>)
- [asyncpg documentation](<https://magicstack.github.io/asyncpg/current/?utm_source=chatgpt.com>)
- [NATS Python client](<https://github.com/nats-io/nats.py?utm_source=chatgpt.com>)

My suggestion: Since you're coming from Node.js and already understand DB/NATS lifecycle management, learn FastAPI's `lifespan`, `app.state`, and dependency injection (`Depends`). Together, these give you a solid foundation for building production-grade FastAPI services.