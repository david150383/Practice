You mean Python dictionary (`dict`) methods, right? We covered those in the previous answer, so I'll share a more practical, interview-focused cheat sheet with additional patterns you can use in Python and FastAPI.

# Python dictionary methods — advanced cheat sheet

## 1. Common methods at a glance

| Method         | Purpose                       | Example                           |
| -------------- | ----------------------------- | --------------------------------- |
| `get()`        | Get a value safely            | `user.get("name")`                |
| `keys()`       | Get all keys                  | `user.keys()`                     |
| `values()`     | Get all values                | `user.values()`                   |
| `items()`      | Get key-value pairs           | `user.items()`                    |
| `update()`     | Add or update entries         | `user.update({"age": 30})`        |
| `pop()`        | Remove key and return value   | `user.pop("age")`                 |
| `popitem()`    | Remove last inserted pair     | `user.popitem()`                  |
| `setdefault()` | Set a default if missing      | `user.setdefault("role", "user")` |
| `copy()`       | Create a shallow copy         | `user.copy()`                     |
| `clear()`      | Remove all entries            | `user.clear()`                    |
| `fromkeys()`   | Create a dictionary from keys | `dict.fromkeys(keys, 0)`          |

## 2. `fromkeys()` — create a dictionary

```
fields = ["name", "email", "age"]
user = dict.fromkeys(fields, None)
print(user)
# {'name': None, 'email': None, 'age': None}
```

JavaScript equivalent:

```
const user = Object.fromEntries(
    ["name", "email", "age"].map(key => [key, null])
);
```

Important: Avoid using a shared mutable default such as `dict.fromkeys(fields, [])` when you expect each key to have its own list. All keys will reference the same list.

## 3. Merge dictionaries

Python 3.9+ supports the `|` operator for merging dictionaries.

```
defaults = {"role": "user", "active": True}
settings = {"role": "admin"}
result = defaults | settings

print(result)
# {'role': 'admin', 'active': True}
```

The right-hand dictionary wins when keys overlap.

You can also use:

```
defaults |= settings  # Update defaults in place
```

JavaScript equivalent:

```
const result = { ...defaults, ...settings };
```

## 4. Safely access nested dictionary values

Suppose you receive API data:

```
user = {
    "name": "John",
    "address": {
        "city": "Hyderabad"
    }
}
```

This can raise `KeyError` if `address` is missing:

```
city = user["address"]["city"]
```

A safer approach:

```
city = user.get("address", {}).get("city")

print(city)
# Hyderabad
```

This returns `None` if either key is missing. Note that `.get()` only protects against missing keys; if `address` exists but is `None`, this chained expression will still raise an `AttributeError`.

## 5. Dictionary comprehension

Create a dictionary from a list:

```
numbers = [1, 2, 3, 4, 5]

squares = {n: n ** 2 for n in numbers}

print(squares)
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

Filter dictionary entries:

```
scores = {
    "John": 85,
    "Alice": 45,
    "Bob": 92
}

passed = {
    name: score
    for name, score in scores.items()
    if score >= 50
}

print(passed)
# {'John': 85, 'Bob': 92}
```

## 6. Count occurrences using a dictionary

A common interview problem:

```
words = ["apple", "banana", "apple", "orange", "banana", "apple"]

counts = {}

for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)
# {'apple': 3, 'banana': 2, 'orange': 1}
```

You can also use `collections.Counter`:

```
from collections import Counter

counts = Counter(words)

print(counts["apple"])  # 3
print(counts.most_common(2))
# [('apple', 3), ('banana', 2)]
```

## 7. `collections.defaultdict`

Useful when grouping items by a key.

```
from collections import defaultdict

orders = [
    {"category": "electronics", "amount": 100},
    {"category": "books", "amount": 30},
    {"category": "electronics", "amount": 200},
]

grouped = defaultdict(list)

for order in orders:
    grouped[order["category"]].append(order)

print(dict(grouped))
```

Unlike a regular dictionary, `defaultdict(list)` automatically creates an empty list for a missing key.

## 8. Dictionary mutability and copying

Dictionaries are mutable.

```
user = {"name": "John", "age": 30}
another = user

another["age"] = 35

print(user["age"])
# 35
```

Both variables reference the same dictionary.

To create a shallow copy:

```
another = user.copy()
```

Nested dictionaries remain shared. For an independent deep copy:

```
import copy

another = copy.deepcopy(user)
```

## 9. Practical FastAPI example

Dictionaries are frequently used to construct API responses or transform data.

```
from fastapi import FastAPI

app = FastAPI()

users = {
    1: {"name": "John", "role": "admin"},
    2: {"name": "Alice", "role": "user"},
}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    user = users.get(user_id)

    if user is None:
        return {"error": "User not found"}

    return {
        "id": user_id,
        **user
    }
```

Here:

- `get()` safely looks up a user.
- `**user` unpacks dictionary entries into another dictionary.
- FastAPI serializes the returned dictionary to JSON.

For a real application, use `HTTPException(status_code=404, detail="User not found")` when you want a proper HTTP 404 response.

What to learn next: Python `set` methods are another useful topic, especially `add()`, `discard()`, `union()`, `intersection()`, and `difference()`. These are frequently useful for removing duplicates and comparing collections.