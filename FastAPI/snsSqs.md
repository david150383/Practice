Boto3 is the official AWS SDK (Software Development Kit) for Python.

Think of it like this:

| Language | AWS SDK |
| --- | --- |
| Python | Boto3 |
| JavaScript / Node.js | AWS SDK for JavaScript (`@aws-sdk/*`) |
| Java | AWS SDK for Java |
| .NET | AWS SDK for .NET |
| Go | AWS SDK for Go |

### What can you do with Boto3?

You can interact with almost all AWS services:

- SQS – Send and receive messages.
- SNS – Publish notifications.
- S3 – Upload and download files.
- DynamoDB – Read and write records.
- SES – Send emails.
- EC2 – Manage virtual machines.
- ECS – Manage containers.
- CloudWatch – Access monitoring and logs.
- Secrets Manager – Retrieve application secrets.

### Example

python

```python
import boto3

s3 = boto3.client("s3")

response = s3.list_buckets()

for bucket in response["Buckets"]:
    print(bucket["Name"])
```

This lists your AWS S3 buckets.

### Install

bash

```bash
pip install boto3
```

Official documentation: [Boto3 – AWS SDK for Python](<https://boto3.amazonaws.com/v1/documentation/api/latest/index.html?utm_source=chatgpt.com>).

One useful thing to remember: Boto3 is primarily a synchronous SDK. If you're building heavily asynchronous FastAPI applications, be mindful that Boto3 calls can block the event loop. You can run them in a thread pool or consider `aioboto3` for an async-oriented interface.


You can use AWS SQS and SNS with FastAPI using the AWS SDK for Python, called Boto3.

If you're familiar with Node.js, think of it this way:

- SNS (Simple Notification Service): Publisher/subscriber messaging. Publishes messages to topics, which can have multiple subscribers.
- SQS (Simple Queue Service): Message queue. Stores messages until consumers process and delete them.
- FastAPI: Your API application that publishes messages or consumes messages.

A common production architecture is:

## 1. How SNS and SQS work together

FastAPI

Order API creates an order

AWS SNS Topic

order-created

SQS Queue 1

Email service

SQS Queue 2

Inventory service

Each queue independently receives the published event.

For example, when an order is created:

1. FastAPI saves the order in PostgreSQL.
2. FastAPI publishes `order.created` to SNS.
3. SNS forwards the message to subscribed SQS queues.
4. Email service consumes its queue.
5. Inventory service consumes its queue.

This architecture allows multiple independent services to react to the same event.

# 2. Install Boto3

bash

```bash
pip install boto3
```

Configure AWS credentials using one of the supported methods:

bash

```bash
aws configure
```

Or use environment variables:

env

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=ap-south-1
```

For production, prefer IAM roles (for example, an ECS task role or EKS workload identity) instead of hardcoding credentials.

# 3. Create SNS and SQS resources in AWS

Before writing code, create these resources in AWS:

1. Create an SNS topic named `order-created`.
2. Create an SQS queue named `email-queue`.
3. Create another SQS queue named `inventory-queue`.
4. Subscribe both SQS queues to the SNS topic.
5. Configure SQS queue policies to allow SNS to send messages to them.

Mastering AWS SQS + SNS: Scalable, Event-Driven Architectures with Spring Boot ☁️ | by Anderson Kuntz Meurer | Medium

[medium.com](<https://medium.com/%40andersonmeurerr/mastering-aws-sqs-sns-scalable-event-driven-architectures-with-spring-boot-%EF%B8%8F-80515746e877?utm_source=chatgpt.com>)

Save these values:

env

```env
AWS_REGION=ap-south-1

SNS_TOPIC_ARN=arn:aws:sns:ap-south-1:123456789012:order-created

SQS_EMAIL_QUEUE_URL=https://sqs.ap-south-1.amazonaws.com/123456789012/email-queue
```

For this example, we'll use SNS for publishing and SQS for consuming.

# 4. Create an AWS service client

Following the service/repository architecture we discussed, I would create a separate AWS infrastructure folder.

text

```text
app/
├── main.py
├── config.py
├── infrastructure/
│   └── aws.py
├── services/
│   ├── sns_service.py
│   └── sqs_service.py
└── routers/
    └── order_router.py
```

infrastructure/aws.py

python

```python
import boto3
import os

AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")

sns_client = boto3.client(
    "sns",
    region_name=AWS_REGION
)

sqs_client = boto3.client(
    "sqs",
    region_name=AWS_REGION
)
```

Boto3 automatically looks for credentials through its credential provider chain.

# 5. Publish messages using SNS

services/sns\_service.py

python

```python
import json

from app.infrastructure.aws import sns_client

class SNSService:

    def __init__(self):
        self.topic_arn = "YOUR_SNS_TOPIC_ARN"

    def publish_message(self, message: dict):

        response = sns_client.publish(
            TopicArn=self.topic_arn,
            Message=json.dumps(message),
            Subject="Order Created"
        )

        return response["MessageId"]
```

Now publish an event from FastAPI.

routers/order\_router.py

python

```python
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.sns_service import SNSService

router = APIRouter()

sns_service = SNSService()


class Order(BaseModel):
    id: int
    product: str
    quantity: int


@router.post("/orders")
def create_order(order: Order):

    message_id = sns_service.publish_message({
        "event": "order.created",
        "data": order.model_dump()
    })

    return {
        "message": "Order event published",
        "message_id": message_id
    }
```

Example request:

json

```json
{
    "id": 101,
    "product": "Laptop",
    "quantity": 2
}
```

SNS publishes this message to the topic. Every subscribed SQS queue receives a copy.

# 6. Consume messages using SQS

Now let's create an SQS consumer.

services/sqs\_service.py

python

```python
import json

from app.infrastructure.aws import sqs_client


class SQSService:

    def __init__(self):
        self.queue_url = "YOUR_SQS_QUEUE_URL"

    def receive_messages(self):

        response = sqs_client.receive_message(
            QueueUrl=self.queue_url,
            MaxNumberOfMessages=10,
            WaitTimeSeconds=20,
            VisibilityTimeout=30
        )

        messages = response.get("Messages", [])

        for message in messages:

            try:
                body = json.loads(message["Body"])

                # SNS envelope: extract the original published message
                event = json.loads(body["Message"])

                print("Received event:", event)

                # Perform business logic here
                self.process_order(event)

                # Delete only after successful processing
                sqs_client.delete_message(
                    QueueUrl=self.queue_url,
                    ReceiptHandle=message["ReceiptHandle"]
                )

            except Exception as e:
                print("Message processing failed:", e)

    def process_order(self, event):
        print("Processing order:", event)
```

Notice these three important things:

- `WaitTimeSeconds=20`: Long polling. SQS waits for messages instead of continuously making empty requests.
- `VisibilityTimeout=30`: Temporarily hides the message while you're processing it.
- `delete_message()`: Deletes the message only after successful processing.

If processing fails, don't delete the message. It becomes visible again after the visibility timeout.

Important: This example assumes SNS delivers its default JSON envelope to SQS. If you enable Raw Message Delivery on the SNS subscription, the consumer should parse `message["Body"]` directly as the original event instead.

# 7. Where should the SQS consumer run?

This is an important architectural decision.

My recommendation: Don't run an infinite SQS polling loop inside your FastAPI request handlers.

Instead, run the consumer as a separate worker process.

Your project could look like this:

text

```text
project/
│
├── app/
│   ├── main.py
│   ├── infrastructure/
│   │   └── aws.py
│   ├── services/
│   │   ├── sns_service.py
│   │   └── sqs_service.py
│   └── routers/
│       └── order_router.py
│
└── worker/
    └── email_worker.py
```

worker/email\_worker.py

python

```python
import time
import logging

from app.services.sqs_service import SQSService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sqs = SQSService()

if __name__ == "__main__":
    logger.info("SQS Worker started")

    try:
        while True:
            sqs.receive_messages()

    except KeyboardInterrupt:
        logger.info("SQS Worker shutting down")
```

Now run two separate processes:

Terminal 1 – FastAPI:

bash

```bash
uvicorn app.main:app --reload
```

Terminal 2 – SQS Worker:

bash

```bash
python -m worker.email_worker
```

You can deploy these as separate Docker containers and scale them independently.

## 8. Important production considerations

| Feature | Why you need it |
| --- | --- |
| Dead Letter Queue (DLQ) | Stores messages that repeatedly fail |
| Visibility Timeout | Prevents concurrent processing of the same message during normal processing |
| Long Polling | Reduces unnecessary SQS requests |
| Idempotency | Prevents duplicate processing |
| Retry mechanism | Handles temporary failures |
| IAM Roles | Secure AWS authentication |
| CloudWatch | Monitors queue depth and failures |

Remember: SQS provides at-least-once delivery in standard queues. Your consumer should be designed to handle duplicate messages safely.

## 9. SNS vs SQS: When to use which?

| Scenario | Use |
| --- | --- |
| Send email notification asynchronously | SQS |
| Multiple services need the same event | SNS + SQS |
| Background processing | SQS |
| Event broadcasting | SNS |
| Order-created events | SNS + SQS |
| Image processing queue | SQS |
| Notification to multiple independent services | SNS + SQS |

## 10. My recommended architecture for your FastAPI projects

## Production microservice architecture

FastAPI API Service

REST APIs and business logic

PostgreSQL

Persistent data

SNS

Event publishing

SQS

Durable message queues

Email Worker

Send notifications

Inventory Worker

Update stock

One more important production detail: if you save an order to PostgreSQL and then publish to SNS, the application could crash between those two operations. For reliable event publishing, consider the Transactional Outbox Pattern.

## Official documentation

- [Boto3 SNS](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sns.html?utm_source=chatgpt.com>)
- [Boto3 SQS](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sqs.html?utm_source=chatgpt.com>)
- [SNS with SQS](<https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html?utm_source=chatgpt.com>)

My recommendation: Keep FastAPI responsible for APIs and event publishing, and run SQS consumers as independent worker services. This is a clean architecture for scaling Python microservices.