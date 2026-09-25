Since you already have backend experience (Node.js/NestJS and PHP/Laravel), I'll focus on the Python equivalents you'll actually use in production.

## Python `list` methods cheat sheet

|
Python

|

Purpose

|

JavaScript equivalent

|
| --- | --- | --- |
|

`append()`

|

Add one item

|

`push()`

|
|

`extend()`

|

Add multiple items

|

`push(...items)`

|
|

`insert()`

|

Insert at index

|

`splice(index,0,item)`

|
|

`remove()`

|

Remove first matching value

|

`splice(index,1)` after `indexOf`

|
|

`pop()`

|

Remove and return item

|

`pop()` / `shift()`

|
|

`clear()`

|

Remove all items

|

`arr.length = 0`

|
|

`index()`

|

Find index

|

`indexOf()`

|
|

`count()`

|

Count occurrences

|

`filter().length`

|
|

`sort()`

|

Sort in place

|

`sort()`

|
|

`reverse()`

|

Reverse in place

|

`reverse()`

|
|

`copy()`

|

Shallow copy

|

`[...arr]`

|

## 1. `append()`

Adds a single item to the end.

Python

Run

```
users = ["John", "Alice"]
users.append("Bob")

print(users)
# ['John', 'Alice', 'Bob']
```

Node.js equivalent:

JavaScript

```
users.push("Bob");
```

## 2. `extend()`

Adds multiple items.

Python

Run

```
numbers = [1, 2]
numbers.extend([3, 4, 5])

print(numbers)
# [1, 2, 3, 4, 5]
```

Equivalent:

JavaScript

```
numbers.push(...[3,4,5]);
```

## 3. `insert()`

Insert at a specific position.

Python

Run

```
colors = ["red", "blue"]
colors.insert(1, "green")

print(colors)
# ['red', 'green', 'blue']
```

Equivalent:

JavaScript

```
colors.splice(1, 0, "green");
```

## 4. `remove()`

Removes the first matching value.

Python

Run

```
fruits = ["apple", "banana", "apple"]

fruits.remove("apple")

print(fruits)
# ['banana', 'apple']
```

Raises `ValueError` if the value doesn't exist.

## 5. `pop()`

Removes and returns an item.

### Last item

Python

Run

```
stack = [1, 2, 3]

item = stack.pop()

print(item)   # 3
print(stack)  # [1,2]
```

### By index

Python

Run

```
queue = ["A", "B", "C"]

first = queue.pop(0)

print(first)  # A
```

## 6. `clear()`

Remove everything.

Python

Run

```
items = [1,2,3]
items.clear()

print(items)
# []
```

## 7. `index()`

Find the position of a value.

Python

Run

```
users = ["John", "Alice", "Bob"]

print(users.index("Alice"))
# 1
```

Raises `ValueError` if not found.

Safe version:

Python

Run

```
if "Alice" in users:
    print(users.index("Alice"))
```

## 8. `count()`

Count occurrences.

Python

Run

```
roles = ["admin", "user", "admin", "guest"]

print(roles.count("admin"))
# 2
```

## 9. `sort()`

Sorts the original list.

Python

Run

```
nums = [5,2,8,1]

nums.sort()

print(nums)
# [1,2,5,8]
```

Descending:

Python

Run

```
nums.sort(reverse=True)
```

### Sort objects

Python

Run

```
users = [
    {"name": "John", "age": 30},
    {"name": "Alice", "age": 25},
]

users.sort(key=lambda x: x["age"])
```

Equivalent to:

JavaScript

```
users.sort((a,b)=>a.age-b.age);
```

## 10. `reverse()`

Reverse in place.

Python

Run

```
letters = ["a","b","c"]

letters.reverse()

print(letters)
# ['c','b','a']
```

## 11. `copy()`

Creates a shallow copy.

Python

Run

```
original = [1,2,3]
duplicate = original.copy()

duplicate.append(4)

print(original)
# [1,2,3]
```

Equivalent:

JavaScript

```
const duplicate = [...original];
```

# Common built-in operations you'll use even more

These aren't list methods, but they're used constantly.

## List slicing

Python

Run

```
nums = [10,20,30,40,50]

nums[1:4]   # [20,30,40]
nums[:3]    # [10,20,30]
nums[2:]    # [30,40,50]
nums[-1]    # 50
nums[::-1]  # reverse copy
```

Equivalent to JavaScript `slice()`.

## List comprehension (Python's superpower)

Instead of:

JavaScript

```
users.filter(u=>u.active).map(u=>u.name)
```

Python:

Python

Run

```
users = [
    {"name":"John","active":True},
    {"name":"Alice","active":False},
    {"name":"Bob","active":True},
]

names = [u["name"] for u in users if u["active"]]

print(names)
# ['John','Bob']
```

## `len()`

Python

Run

```
items = [1,2,3]

len(items)
# 3
```

Equivalent: `arr.length`.

## Membership check

Python

Run

```
if "admin" in roles:
    print("Found")
```

Equivalent: `includes()`.

## `enumerate()`

Very common when you need index + value.

Python

Run

```
users = ["John", "Alice", "Bob"]

for index, name in enumerate(users):
    print(index, name)
```

Output:

```
0 John
1 Alice
2 Bob
```

Equivalent to:

JavaScript

```
users.forEach((name,index)=>console.log(index,name));
```

# Production example

Imagine you're processing an order.

Python

Run

```
cart = []

cart.append({"id": 1, "qty": 2})
cart.append({"id": 2, "qty": 1})

# Increase quantity
cart[0]["qty"] += 1

# Sort by product id
cart.sort(key=lambda item: item["id"])

# Get total quantity
total_qty = sum(item["qty"] for item in cart)

print(total_qty)
# 4
```

This combines `append()`, indexing, `sort(key=...)`, and a generator expression—patterns you'll frequently see in FastAPI and general Python backend code.
