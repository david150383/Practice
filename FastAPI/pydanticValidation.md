Pydantic provides quite a lot of validation options, but one important thing to understand first:

Not every validation rule belongs to `Field()`. Some validations are provided through special types such as `EmailStr`, `HttpUrl`, `SecretStr`, and `UUID`. Others require custom validators.

Below is a practical reference for Pydantic V2, which is what you're using with FastAPI.

# 1. String validation rules

These are commonly used for names, usernames, passwords, phone numbers, etc.

| Rule | Purpose | Example |
| --- | --- | --- |
| `min_length` | Minimum characters | `min_length=3` |
| `max_length` | Maximum characters | `max_length=20` |
| `pattern` | Match regex | `pattern=r"^[a-z]+$"` |
| `strict` | Don't coerce other types | `strict=True` |

There are also string transformations available through `StringConstraints`:

| Rule | Purpose |
| --- | --- |
| `strip_whitespace` | Remove leading/trailing spaces |
| `to_lower` | Convert to lowercase |
| `to_upper` | Convert to uppercase |
| `ascii_only` | Allow only ASCII characters |

Example:

python

```python
from pydantic import BaseModel, Field, StringConstraints
from typing import Annotated

class User(BaseModel):
    username: Annotated[
        str,
        StringConstraints(
            min_length=3,
            max_length=20,
            strip_whitespace=True,
            to_lower=True
        )
    ]
```

`StringConstraints` is useful when you want both validation and automatic string transformation.


# 2. Number validation rules

Useful for age, price, quantity, ratings, etc.

| Rule | Meaning | Example |
| --- | --- | --- |
| `gt` | Greater than | `gt=18` |
| `ge` | Greater than or equal | `ge=18` |
| `lt` | Less than | `lt=100` |
| `le` | Less than or equal | `le=100` |
| `multiple_of` | Must be a multiple | `multiple_of=5` |
| `allow_inf_nan` | Allow infinity and NaN for float/Decimal | `allow_inf_nan=False` |

Example:

python

```python
class User(BaseModel):
    age: int = Field(ge=18, le=100)
    salary: float = Field(gt=0)
    rating: float = Field(ge=0, le=5)
    quantity: int = Field(gt=0, multiple_of=5)
```

# 3. Decimal validation rules

Useful for money, financial amounts, and precise decimal values.

| Rule | Purpose |
| --- | --- |
| `max_digits` | Maximum total digits |
| `decimal_places` | Maximum digits after decimal |

Example:

python

```python
from decimal import Decimal

class Product(BaseModel):
    price: Decimal = Field(
        gt=0,
        max_digits=8,
        decimal_places=2
    )
```

This allows values such as `12345.67` while enforcing the configured precision.


# 4. Email validation

For email, you don't use `Field(email=True)`.

Pydantic provides a special type called `EmailStr`.

python

```python
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
```

Valid example:

json

```json
{
    "email": "mohan@gmail.com"
}
```

Invalid example:

json

```json
{
    "email": "mohan123"
}
```

Install the required dependency:

bash

```bash
pip install email-validator
```

Other useful email-related types:

- `EmailStr` – validates an email address.
- `NameEmail` – validates an email with an optional display name.

# 5. Password validation

There is no built-in `password=True` or `Field(password=True)` option.

You can combine `SecretStr`, `Field`, and a regular expression.

For example, suppose you want:

- Minimum 8 characters.
- Maximum 20 characters.
- At least one uppercase letter.
- At least one lowercase letter.
- At least one digit.
- At least one special character.

python

```python
from pydantic import BaseModel, Field, SecretStr

class User(BaseModel):
    password: SecretStr = Field(
        min_length=8,
        max_length=20,
        pattern=r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$"
    )
```

`SecretStr` masks the password when the model is printed:

python

```python
user = User(password="Mohan@123")

print(user.password)
# **********
```

To access the actual password:

python

```python
user.password.get_secret_value()
```

Important: `SecretStr` doesn't encrypt or hash passwords. In a real application, hash passwords using a suitable password-hashing algorithm such as Argon2 before storing them.

# 6. Other useful special types

These are not `Field()` arguments. They are types you can use directly in your Pydantic models.

| Type | Purpose |
| --- | --- |
| `EmailStr` | Email validation |
| `NameEmail` | Name + email |
| `HttpUrl` | HTTP/HTTPS URL validation |
| `AnyUrl` | General URL validation |
| `UUID` | UUID validation |
| `IPvAnyAddress` | IPv4 or IPv6 address |
| `IPvAnyNetwork` | IP network |
| `IPvAnyInterface` | IP interface |
| `SecretStr` | Hide sensitive strings |
| `SecretBytes` | Hide sensitive bytes |
| `PositiveInt` | Integer greater than 0 |
| `NegativeInt` | Integer less than 0 |
| `NonNegativeInt` | Integer greater than or equal to 0 |
| `NonPositiveInt` | Integer less than or equal to 0 |
| `PositiveFloat` | Float greater than 0 |
| `NegativeFloat` | Float less than 0 |
| `FiniteFloat` | Reject infinity and NaN |
| `StrictInt` | Strict integer |
| `StrictStr` | Strict string |
| `StrictBool` | Strict boolean |

Example:

python

```python
from pydantic import (
    BaseModel,
    EmailStr,
    HttpUrl,
    PositiveInt,
    SecretStr,
    UUID4
)

class User(BaseModel):
    id: UUID4
    name: str
    email: EmailStr
    password: SecretStr
    age: PositiveInt
    website: HttpUrl
```

For `UUID4`, import it from Pydantic:

python

```python
from pydantic import UUID4
```


# 7. List and collection validation

You can validate lists using `min_length` and `max_length`.

python

```python
class User(BaseModel):
    hobbies: list[str] = Field(
        min_length=1,
        max_length=5
    )
```

This requires at least one hobby and allows at most five.

You can also validate individual list elements:

python

```python
from typing import Annotated

class User(BaseModel):
    scores: list[Annotated[int, Field(ge=0, le=100)]]
```

Every score must be between 0 and 100.

Other useful collection types:

- `list[str]`
- `set[str]`
- `tuple[int, int]`
- `dict[str, int]`
- `frozenset[str]`

# 8. Other important Field() parameters

Apart from validation constraints, `Field()` supports metadata and model behavior.

| Parameter | Purpose |
| --- | --- |
| `default` | Set default value |
| `default_factory` | Generate default dynamically |
| `alias` | Alternative input/output field name |
| `validation_alias` | Alternative name for validation input |
| `serialization_alias` | Alternative name when serializing |
| `title` | Field title in API documentation |
| `description` | Field description |
| `examples` | Provide examples |
| `strict` | Enable strict validation |
| `frozen` | Prevent field reassignment |
| `exclude` | Exclude field during serialization |
| `exclude_if` | Exclude field based on a condition |
| `repr` | Include field in model representation |
| `deprecated` | Mark field as deprecated |
| `validate_default` | Validate the default value |
| `json_schema_extra` | Add extra JSON Schema metadata |

Example:

python

```python
class User(BaseModel):
    name: str = Field(
        default="Mohan",
        min_length=3,
        max_length=20,
        title="Username",
        description="Enter your username",
        examples=["Mohan"],
        strict=True
    )
```

# 9. Custom validation using field\_validator

Sometimes built-in rules are not enough.

For example:

- Password and confirm password must match.
- Phone number must contain exactly 10 digits.
- Username must not contain spaces.
- Age must be calculated or validated using custom logic.

Use `field_validator`.

python

```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    username: str
    phone: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        if " " in value:
            raise ValueError("Username cannot contain spaces")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        if not value.isdigit() or len(value) != 10:
            raise ValueError("Phone must contain exactly 10 digits")
        return value
```

For validation involving multiple fields, use `model_validator`.

Example: password and confirm password must match.

python

```python
from pydantic import BaseModel, SecretStr, model_validator

class User(BaseModel):
    password: SecretStr
    confirm_password: SecretStr

    @model_validator(mode="after")
    def check_password(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self
```

# 10. Complete practical FastAPI example

Here is an example combining several of these validations.

python

```python
from fastapi import FastAPI
from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    SecretStr,
    HttpUrl,
    PositiveInt
)

app = FastAPI()

class User(BaseModel):
    name: str = Field(
        min_length=3,
        max_length=20
    )

    email: EmailStr

    password: SecretStr = Field(
        min_length=8,
        max_length=20,
        pattern=r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$"
    )

    age: PositiveInt

    website: HttpUrl | None = None


@app.post("/users")
async def create_user(user: User):
    return {
        "name": user.name,
        "email": user.email,
        "age": user.age,
        "website": user.website
    }
```

# 11. Quick revision cheat sheet

| What you want | What to use |
| --- | --- |
| Minimum string length | `Field(min_length=3)` |
| Maximum string length | `Field(max_length=20)` |
| Regex validation | `Field(pattern=r"...")` |
| Greater than | `Field(gt=10)` |
| Greater than or equal | `Field(ge=10)` |
| Less than | `Field(lt=100)` |
| Less than or equal | `Field(le=100)` |
| Multiple of | `Field(multiple_of=5)` |
| Email | `EmailStr` |
| Password masking | `SecretStr` |
| URL | `HttpUrl` |
| UUID | `UUID4` |
| Positive integer | `PositiveInt` |
| Strict integer | `StrictInt` |
| List length | `Field(min_length=1, max_length=5)` |
| Decimal precision | `max_digits`, `decimal_places` |
| Custom field validation | `@field_validator` |
| Multiple field validation | `@model_validator` |

One important version difference: If you find tutorials using `regex=`, `min_items=`, or `max_items=`, those are older Pydantic V1 conventions. In V2, use `pattern=`, `min_length=`, and `max_length=` respectively.


## Official documentation

- [Pydantic Field documentation](<https://pydantic.dev/docs/validation/latest/concepts/fields/?utm_source=chatgpt.com>)
- [Pydantic types and validation](<https://pydantic.dev/docs/validation/latest/concepts/types/?utm_source=chatgpt.com>)
- [Custom validators](<https://pydantic.dev/docs/validation/latest/concepts/validators/?utm_source=chatgpt.com>)
- [FastAPI request body validation](<https://fastapi.tiangolo.com/tutorial/body/?utm_source=chatgpt.com>)

My recommendation: Learn `Field()`, `EmailStr`, `SecretStr`, `field_validator`, and `model_validator` thoroughly. These five concepts will cover a large portion of everyday FastAPI request validation.