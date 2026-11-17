Python/FastAPI has exactly what you're looking for: OpenTelemetry Zero-Code Auto-Instrumentation.

It's quite similar to installing a Laravel Composer package and getting automatic tracing without modifying your application code.

The official OpenTelemetry Python agent can automatically instrument FastAPI, database drivers, HTTP clients and Python logging.

OpenTelemetry

+1

## 1. Install the packages

Inside your virtual environment:

bash

```bash
pip install opentelemetry-distro
pip install opentelemetry-exporter-otlp

opentelemetry-bootstrap -a install
```

What these packages do:

- `opentelemetry-distro`: Installs the OpenTelemetry API, SDK and instrumentation tooling.
- `opentelemetry-exporter-otlp`: Sends telemetry to an OpenTelemetry Collector or compatible backend.
- `opentelemetry-bootstrap`: Detects installed libraries and installs their matching instrumentation packages.

OpenTelemetry

+1

## 2. Configure environment variables

For example, create a `.env` file:

env

```env
OTEL_SERVICE_NAME=my-fastapi-service

OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318

OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf

OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp
```

This assumes your OpenTelemetry Collector is listening on port `4318` for OTLP HTTP.

## 3. Start FastAPI without changing your code

Normally, you run:

bash

```bash
uvicorn app.main:app --reload
```

With automatic instrumentation:

bash

```bash
opentelemetry-instrument uvicorn app.main:app
```

That's it\!

You don't need to add tracing middleware manually.

## 4. What gets instrumented automatically?

| Component | Automatic instrumentation |
| --- | --- |
| FastAPI | Yes |
| Starlette | Yes |
| SQLAlchemy | Yes |
| PostgreSQL drivers | Yes |
| HTTPX | Yes |
| Requests | Yes |
| Redis | Yes |
| Python logging | Yes |
| Custom business functions | Manual instrumentation needed |

The exact instrumentation depends on which corresponding instrumentation packages are installed.

OpenTelemetry

+1

## 5. What will you get?

Suppose your API executes:

python

```python
@app.post("/users")
async def create_user(user: UserCreate):
    db_user = repository.create(user)
    return db_user
```

OpenTelemetry can automatically capture:

## Example distributed trace

POST /users

HTTP 200FastAPI request · 120 ms

SQL INSERT

PostgreSQL · 35 ms

HTTP POST

External API · 50 ms

Trace ID

abc123...xyz789

You can see request duration, database query spans, HTTP calls, exceptions and correlated logs.

## 6. What about automatic logs?

OpenTelemetry can automatically attach a logging handler to Python's standard logging system.

For example:

python

```python
import logging

logger = logging.getLogger(__name__)

@app.get("/")
async def home():
    logger.info("Home endpoint called")
    return {"message": "Hello"}
```

The logs can be exported through OTLP and correlated with traces.

OpenTelemetry

+1

## 7. Which observability backend should you use?

OpenTelemetry is the instrumentation standard. You still need somewhere to store and visualize the telemetry.

File:Grafana logo.svg - Wikimedia Commons

Grafana + Tempo + Loki + Prometheus

Great open-source stack for traces, logs and metrics.

[Grafana ecosystem](<https://grafana.com/oss/?utm_source=chatgpt.com>)

Platform Tooling | Platform Engineering

Jaeger

Distributed tracing and request visualization.

[Jaeger](<https://www.jaegertracing.io/?utm_source=chatgpt.com>)

Datadog Logo Png | Datadog Logo Vector | Datadog Logo: Vigilant Canine of Cloud Observability | Data-Driven Mascot | Modern Tech Branding | Digital Watchdog - freepng

Datadog

Managed observability platform with traces, logs and metrics.

[Datadog](<https://www.datadoghq.com/?utm_source=chatgpt.com>)

## 8. My recommendation for your FastAPI architecture

Since you're building applications with FastAPI, SQLAlchemy, PostgreSQL, SNS and SQS, I'd use:

FastAPI + SQS Workers

OpenTelemetry Auto-Instrumentation

Traces · Metrics · Logs

OpenTelemetry Collector

Receives and exports telemetry

Grafana + Tempo + Loki + Prometheus

Visualization and monitoring

One important limitation: Automatic instrumentation captures framework and supported library operations, but it won't automatically understand your business operations. For example, `create_order()`, `calculate_tax()` and `process_payment()` won't necessarily appear as meaningful individual spans unless you add custom instrumentation.

Also, Boto3/SQS instrumentation needs the appropriate AWS instrumentation package; don't assume installing the basic agent automatically covers every AWS operation.

Bottom line: Start with `opentelemetry-distro` and `opentelemetry-bootstrap -a install`. You can get substantial observability without changing your FastAPI application code.

Official guide: [OpenTelemetry Python Zero-Code Instrumentation](<https://opentelemetry.io/docs/zero-code/python/?utm_source=chatgpt.com>).