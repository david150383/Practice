# What is the GIL in Python?

GIL stands for Global Interpreter Lock. In traditional CPython, it is a lock that allows only one thread at a time to execute Python bytecode within an interpreter.

Since you know Node.js and its event loop, the important distinction is this: the GIL is not an event loop. The GIL controls access to Python execution in a traditional CPython build, while an event loop schedules asynchronous tasks.

## 1. Why does Python have a GIL?

Imagine a Python application running four threads to process data.
<div align="center"> 
<span style="font-weight: bold;">Four Python threads</span>

Thread 1 · Thread 2 · Thread 3 · Thread 4
&darr;
<span style="font-weight: bold;">GIL — Global Interpreter Lock</span>

Only one thread executes Python bytecode at a time in traditional CPython
&darr;
<span style="font-weight: bold;">CPython interpreter</span>

Executes Python code
</div>

The GIL historically simplified CPython's memory management, particularly reference counting, and helped protect interpreter internals.

It does not mean Python supports only one thread in total. Multiple threads can exist, and threads can perform I/O concurrently. The restriction concerns simultaneous execution of Python bytecode in the traditional GIL-enabled interpreter.

## 2. How does the GIL affect CPU-bound tasks?

Consider a function that performs a lot of calculations.

```
def calculate():
    total = 0

    for i in range(10_000_000):
        total += i * i

    return total
```

Suppose you run this function in four threads.

In a traditional GIL-enabled CPython build, the threads cannot execute Python bytecode in parallel within the same interpreter. They compete for the GIL, so adding threads often does not speed up CPU-bound Python code.

This differs from I/O-bound workloads, where threads can make progress while other threads wait for network or file operations.


### CPU-bound vs. I/O-bound

| Workload                       | Example                                         | Does threading help?                                      |
| ------------------------------ | ----------------------------------------------- | --------------------------------------------------------- |
| CPU-bound                      | Image processing in pure Python                 | Usually not for parallel execution in traditional CPython |
| I/O-bound                      | Calling multiple external APIs                  | Often yes                                                 |
| CPU-bound with multiprocessing | Heavy calculations across processes             | Yes, potentially, by using multiple CPU cores             |
| Async I/O                      | FastAPI awaiting an asynchronous database query | Yes, for concurrency while waiting                        |

## 3. How do you work around the GIL?

There are three main approaches.

### Option 1: Multiprocessing

Use multiple processes, each with its own Python interpreter. This allows CPU-bound Python code to run in parallel across cores.

Best for: computationally intensive jobs.

### Option 2: Asyncio

Use `async` and `await` for I/O-bound operations. The event loop switches between tasks while they wait, but this does not remove the GIL.

Best for: concurrent HTTP calls, async database operations, and network services.

### Option 3: Free-threaded CPython

Python 3.13 introduced builds that can run without the GIL. This support is no longer considered experimental starting with Python 3.14, but free-threaded builds are still optional rather than the default. Compatibility and performance depend on your application and its dependencies.


Best for: workloads that can benefit from multithreaded CPU parallelism and whose dependencies support free threading.

## 4. How to check whether the GIL is enabled

Run this using Python 3.13 or later:

```
import sys

if hasattr(sys, "_is_gil_enabled"):
    print("GIL enabled:", sys._is_gil_enabled())
else:
    print("This Python build does not expose the GIL status API.")
```

On a regular CPython installation, you will generally see:

```
GIL enabled: True
```

The exact result depends on the interpreter build and runtime configuration.


## 5. Common interview questions

Q1. Does the GIL prevent multithreading in Python?

No. Python supports multiple threads, but in traditional CPython only one thread at a time executes Python bytecode within an interpreter.

Q2. Does `asyncio` solve the GIL problem?

No. `asyncio` helps manage concurrent I/O operations; it does not enable CPU-bound Python bytecode to run in parallel.

Q3. Why is multiprocessing useful?

Separate processes have separate interpreters, so CPU-intensive Python code can run on multiple CPU cores without competing for one shared GIL.

Q4. Does every Python implementation have a GIL?

No. The GIL is primarily associated with traditional CPython. Other implementations can have different execution models, and CPython itself now supports optional free-threaded builds.

Q5. Has the GIL been removed in Python 3.14?

Not from the default Python build. Python 3.14 supports free-threaded builds as a supported option, while the conventional GIL-enabled build remains the default.



### The one thing to remember

- Event loop: manages which asynchronous task runs next.
- GIL: limits simultaneous Python bytecode execution in traditional CPython.
- Multiprocessing: enables CPU parallelism using separate processes.
- Free-threaded Python: enables parallel Python thread execution without the traditional GIL.