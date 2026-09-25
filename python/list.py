"""
1. append()
Adds a single item to the end.
"""
users = ["John", "Alice"]
users.append("Bob")

print(users)
# ['John', 'Alice', 'Bob']

"""
2. extend()
Adds multiple items.
"""
numbers = [1, 2]
numbers.extend([3, 4, 5])
print(numbers)
# [1, 2, 3, 4, 5]


"""
3. insert()

Insert at a specific position.
"""
colors = ["red", "blue"]
colors.insert(1, "green")

print(colors)
# ['red', 'green', 'blue']

"""
4. remove()

Removes the first matching value.
"""
fruits = ["apple", "banana", "apple"]

fruits.remove("apple")

print(fruits)
# ['banana', 'apple']
# Raises ValueError if the value doesn't exist.

"""
5. pop()
Removes and returns an item.
"""
stack = [1, 2, 3]

item = stack.pop()

print(item)   # 3
print(stack)  # [1,2]

# By index
queue = ["A", "B", "C"]

first = queue.pop(0)

print(first)  # A

"""
6. clear()
Remove everything.
"""
items = [1, 2, 3]
items.clear()

print(items)
# []

"""
7. index()
Find the position of a value.
"""
users = ["John", "Alice", "Bob"]

print(users.index("Alice"))
# 1
"""
Raises ValueError if not found.
Safe version:
"""
if "Alice" in users:
    print(users.index("Alice"))

"""
8. count()

Count occurrences.
"""
roles = ["admin", "user", "admin", "guest"]

print(roles.count("admin"))
# 2
"""
9. sort()

Sorts the original list.
"""
nums = [5, 2, 8, 1]
strings = ["z", "b", "a", "y"]
nums.sort()

print(nums)
# [1,2,5,8]

strings.sort()
print(strings)
# ['a', 'b', 'y', 'z']

# Descending:
nums.sort(reverse=True)
print(nums)
strings.sort(reverse=True)
print(strings)

# Sort objects
users = [
    {"name": "John", "age": 30},
    {"name": "Alice", "age": 25},
]

users.sort(key=lambda x: x["age"])
print(users)

"""
10. reverse()
Reverse in place.
"""
letters = ["a", "b", "c"]

letters.reverse()

print(letters)
# ['c','b','a']

"""
11. copy()
Creates a shallow copy.
"""
original = [1, 2, 3]
duplicate = original.copy()
duplicate.append(4)

print(original)
# [1,2,3]

"""
12. len()
"""
items = [1, 2, 3]

len(items)
# Equivalent: arr.length.
# 3

"""
13. Membership check
"""
if "admin" in roles:
    print("Found")
# Equivalent: includes().

"""
14. enumerate()
Very common when you need index + value.
"""
users = ["John", "Alice", "Bob"]

for index, name in enumerate(users):
    print(index, name)

# Output
#0 John
#1 Alice
#2 Bob

# Equivalent to:    users.forEach((name,index)=>console.log(index,name));
"""

Common built-in operations you'll use even more

These aren't list methods, but they're used constantly.
List slicing
"""
nums = [10, 20, 30, 40, 50]

nums[1:4]   # [20,30,40]
nums[:3]    # [10,20,30]
nums[2:]    # [30,40,50]
nums[-1]    # 50
nums[::-1]  # reverse copy
# Equivalent to JavaScript slice().

"""
List comprehension (Python's superpower)


"""
# Instead of:
# users.filter(u= >u.active).map(u=>u.name)
users = [
    {"name": "John", "active": True},
    {"name": "Alice", "active": False},
    {"name": "Bob", "active": True},
]

names = [u["name"] for u in users if u["active"]]

print(names)
# ['John','Bob']

