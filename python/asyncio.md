In Python, `async` and `await` are used for asynchronous programming. They are especially useful in FastAPI, HTTP requests, database calls, and microservices when tasks spend time waiting for I/O.

Since you know Node.js, you can think of Python's `async/await` as conceptually similar to JavaScript's `async/await`.

## 1. Basic Python async/await example

```

import asyncio


async def fetch_user():
    print("Fetching user...")
    await asyncio.sleep(2)  # Simulate an I/O wait
    return {"id": 1, "name": "Alice"}


async def main():
    user = await fetch_user()
    print(user)


asyncio.run(main())

# Output:
# Fetching user...
# (waits approximately 2 seconds)
# {'id': 1, 'name': 'Alice'}

```

How it works:

- `async def` defines a coroutine function.
- `await` waits for an asynchronous operation to finish, allowing the event loop to run other tasks in the meantime.
- `asyncio.run(main())` starts the event loop and runs the main coroutine.

Note that `await` does not automatically make a blocking function asynchronous. The operation being awaited must cooperate with the event loop.

## 2. Run multiple tasks concurrently

Suppose you need to fetch a user, their orders, and their payments. Each operation takes two seconds.

```

import asyncio


async def fetch_user():
    await asyncio.sleep(2)
    return "User fetched"


async def fetch_orders():
    await asyncio.sleep(2)
    return "Orders fetched"


async def fetch_payments():
    await asyncio.sleep(2)
    return "Payments fetched"


async def main():
    results = await asyncio.gather(
        fetch_user(),
        fetch_orders(),
        fetch_payments(),
    )

    for result in results:
        print(result)


asyncio.run(main())

# Output:
# User fetched
# Orders fetched
# Payments fetched
# Total time: approximately 2 seconds

```

### Execution timeline

Each task waits for two seconds. The event loop lets the waits overlap.

Fetch user

Fetch orders

Fetch payments

0 seconds

2 seconds

4 seconds

6 seconds

Total: approximately 2 seconds, instead of approximately 6 seconds sequentially.

`asyncio.gather()` schedules the supplied coroutines to run concurrently and returns their results in the same order as the inputs.

## 3. Compare Python and Node.js

| Python                     | Node.js                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `async def fetch()`        | `async function fetch()`                                        |
| `await fetch()`            | `await fetch()`                                                 |
| `asyncio.sleep(2)`         | `await new Promise(r => setTimeout(r, 2000))`                   |
| `asyncio.gather(a(), b())` | `Promise.all([a(), b()])`                                       |
| `asyncio.run(main())`      | Top-level `await main()` in supported environments, or `main()` |

## 4. Real-world example: concurrent API requests

For actual HTTP calls, you can use `httpx` with Python's async client.

Install it:

```
pip install httpx
```

```

import asyncio
import httpx


async def fetch_post(client: httpx.AsyncClient, post_id: int):
    response = await client.get(
        f"https://jsonplaceholder.typicode.com/posts/{post_id}"
    )
    response.raise_for_status()
    return response.json()


async def main():
    async with httpx.AsyncClient(timeout=10.0) as client:
        posts = await asyncio.gather(
            fetch_post(client, 1),
            fetch_post(client, 2),
            fetch_post(client, 3),
        )

        for post in posts:
            print(post["id"], post["title"])


asyncio.run(main())

```

This sends three HTTP requests concurrently and reuses one HTTP client. In production, also consider connection limits, timeouts, retries, and upstream rate limits.

## 5. Important interview concepts

- Coroutine: An asynchronous function defined using `async def`.
- `await`: Suspends the current coroutine until an awaitable completes, letting the event loop run other work.
- Concurrency: Multiple tasks make progress during overlapping periods; they do not necessarily execute CPU instructions simultaneously.
- `asyncio.gather()`: Runs multiple awaitables concurrently and collects their results.
- `asyncio.create_task()`: Schedules a coroutine to run as a task.
- Blocking vs. non-blocking: Calling `time.sleep(2)` inside an async function blocks the event-loop thread; `await asyncio.sleep(2)` does not.

Remember: Python `async/await` is most beneficial for I/O-bound work, such as HTTP requests and asynchronous database queries. CPU-heavy work usually needs multiprocessing, a process pool, or another appropriate execution strategy rather than simply adding `async`.