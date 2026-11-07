"""
Python Dictionary (dict) Methods Cheat Sheet
Equivalent concepts from JavaScript Objects
"""

"""
1. get()

Get a value safely.
Returns None if the key does not exist.
You can provide a default value.
"""

import copy
user = {"name": "John", "age": 30}

print(user.get("name"))
# John

print(user.get("email"))
# None

print(user.get("email", "unknown@example.com"))
# unknown@example.com


"""
2. keys()

Get all dictionary keys.
"""

user = {"name": "John", "age": 30}

print(user.keys())
# dict_keys(['name', 'age'])

print(list(user.keys()))
# ['name', 'age']

# JavaScript equivalent: Object.keys(user)


"""
3. values()

Get all dictionary values.
"""

user = {"name": "John", "age": 30}

print(user.values())
# dict_values(['John', 30])

print(list(user.values()))
# ['John', 30]

# JavaScript equivalent: Object.values(user)


"""
4. items()

Get key-value pairs.
Very useful when iterating over a dictionary.
"""

user = {"name": "John", "age": 30}

print(user.items())
# dict_items([('name', 'John'), ('age', 30)])

for key, value in user.items():
    print(key, value)

# name John
# age 30

# JavaScript equivalent: Object.entries(user)


"""
5. update()

Add new keys or update existing keys.
"""

user = {"name": "John", "age": 30}

user.update({"age": 31, "city": "Hyderabad"})

print(user)
# {'name': 'John', 'age': 31, 'city': 'Hyderabad'}


"""
6. pop()

Remove a key and return its value.
Raises KeyError if the key is missing and no default is supplied.
"""

user = {"name": "John", "age": 30}

age = user.pop("age")

print(age)
# 30

print(user)
# {'name': 'John'}

# Safe version with a default
email = user.pop("email", None)

print(email)
# None


"""
7. popitem()

Remove and return the last inserted key-value pair.
"""

user = {
    "name": "John",
    "age": 30,
    "city": "Hyderabad"
}

item = user.popitem()

print(item)
# ('city', 'Hyderabad')

print(user)
# {'name': 'John', 'age': 30}


"""
8. setdefault()

Return the existing value if the key exists.
Otherwise, insert the key with the supplied default.
"""

user = {"name": "John"}

age = user.setdefault("age", 18)

print(age)
# 18

print(user)
# {'name': 'John', 'age': 18}

# Existing values are not overwritten.
user.setdefault("age", 25)

print(user["age"])
# 18


"""
9. copy()

Create a shallow copy of a dictionary.
"""

original = {"name": "John", "age": 30}

duplicate = original.copy()
duplicate["age"] = 35

print(original)
# {'name': 'John', 'age': 30}

print(duplicate)
# {'name': 'John', 'age': 35}


"""
10. clear()

Remove all items from the dictionary.
"""

user = {"name": "John", "age": 30}

user.clear()

print(user)
# {}


"""
11. fromkeys()

Create a dictionary using the given keys and a default value.
"""

fields = ["name", "email", "age"]

user = dict.fromkeys(fields, None)

print(user)
# {'name': None, 'email': None, 'age': None}


"""
12. len()

Get the number of key-value pairs.
This is a built-in function, not a dictionary method.
"""

user = {"name": "John", "age": 30}

print(len(user))
# 2

# JavaScript equivalent: Object.keys(user).length


"""
13. Membership check

Check whether a key exists in the dictionary.
"""

user = {"name": "John", "age": 30}

if "name" in user:
    print("Name exists")
# Name exists

if "email" not in user:
    print("Email does not exist")
# Email does not exist

# Python checks dictionary keys by default, not values.


"""
14. Add or update a value

Assign a value using its key.
"""

user = {"name": "John", "age": 30}

user["city"] = "Hyderabad"
user["age"] = 31

print(user)
# {'name': 'John', 'age': 31, 'city': 'Hyderabad'}


"""
15. Dictionary merging (Python 3.9+)

Use | to create a merged dictionary.
The right-hand dictionary wins for duplicate keys.
"""

defaults = {"role": "user", "active": True}
settings = {"role": "admin", "city": "Hyderabad"}

result = defaults | settings

print(result)
# {'role': 'admin', 'active': True, 'city': 'Hyderabad'}

# Update the original dictionary in place:
defaults |= settings

print(defaults)
# {'role': 'admin', 'active': True, 'city': 'Hyderabad'}


"""
16. Dictionary comprehension

Create a dictionary from an iterable.
"""

numbers = [1, 2, 3, 4, 5]

squares = {number: number ** 2 for number in numbers}

print(squares)
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}


"""
17. Dictionary comprehension with filtering

Keep only entries matching a condition.
"""

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


"""
18. Count occurrences using a dictionary

A common interview question.
"""

words = ["apple", "banana", "apple", "orange", "banana", "apple"]

counts = {}

for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)
# {'apple': 3, 'banana': 2, 'orange': 1}


"""
19. Nested dictionary access

Common when processing API responses.
"""

order = {
    "id": 1001,
    "customer": {
        "id": 50,
        "name": "John"
    }
}

print(order["customer"]["name"])
# John

# Safer if the customer key might be missing:
print(order.get("customer", {}).get("name"))
# John


"""
20. Deep copy

A shallow copy does not copy nested dictionaries independently.
Use deepcopy() when an independent nested copy is needed.
"""


original = {
    "name": "John",
    "address": {
        "city": "Hyderabad"
    }
}

duplicate = copy.deepcopy(original)

duplicate["address"]["city"] = "Delhi"

print(original["address"]["city"])
# Hyderabad

print(duplicate["address"]["city"])
# Delhi


"""
21. Loop through dictionary keys
"""

user = {"name": "John", "age": 30}

for key in user:
    print(key)

# name
# age


"""
22. Loop through dictionary values
"""

user = {"name": "John", "age": 30}

for value in user.values():
    print(value)

# John
# 30


"""
23. Get keys and values together
"""

user = {"name": "John", "age": 30}

for key, value in user.items():
    print(f"{key} = {value}")

# name = John
# age = 30


"""
24. Dictionary keys can be different hashable types

Unlike JavaScript object keys, Python dictionary keys
do not have to be strings.
"""

data = {
    1: "one",
    "name": "John",
    (10, 20): "coordinate"
}

print(data[1])
# one

print(data["name"])
# John

print(data[(10, 20)])
# coordinate

# Lists and dictionaries cannot be dictionary keys because
# they are unhashable.
