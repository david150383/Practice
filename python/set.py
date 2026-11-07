# ============================================
# Python Set Methods and Operations
# File: set_methods.py
# ============================================


# 1. add()
"""
Description:
Adds a single element to a set.
Duplicate elements are ignored.

JavaScript equivalent:
There is no native Set.add() difference in usage;
JavaScript also supports set.add(value).
"""

numbers = {1, 2, 3}
numbers.add(4)
numbers.add(2)

print(numbers)  # Output: {1, 2, 3, 4} (order may vary)


# 2. update()
"""
Description:
Adds multiple elements from an iterable to a set.
Accepts lists, tuples, sets, and other iterables.
"""

numbers = {1, 2, 3}
numbers.update([3, 4, 5])

print(numbers)  # Output: {1, 2, 3, 4, 5} (order may vary)


# 3. remove()
"""
Description:
Removes an element from a set.
Raises KeyError if the element does not exist.
"""

numbers = {1, 2, 3}
numbers.remove(2)

print(numbers)  # Output: {1, 3}

# numbers.remove(10)  # Raises KeyError


# 4. discard()
"""
Description:
Removes an element if it exists.
Unlike remove(), it does not raise an error
when the element is missing.
"""

numbers = {1, 2, 3}
numbers.discard(2)
numbers.discard(10)

print(numbers)  # Output: {1, 3}


# 5. pop()
"""
Description:
Removes and returns an arbitrary element.
You should not depend on which element is removed.
Raises KeyError if the set is empty.
"""

numbers = {10, 20, 30}
removed = numbers.pop()

print(removed)  # Output: One of 10, 20, or 30
print(numbers)  # Output: The remaining two elements


# 6. clear()
"""
Description:
Removes all elements from a set.
The set itself still exists but becomes empty.
"""

numbers = {1, 2, 3}
numbers.clear()

print(numbers)  # Output: set()


# 7. copy()
"""
Description:
Creates a shallow copy of a set.
Changes to the copied set do not affect the original set.
"""

original = {1, 2, 3}
copied = original.copy()

copied.add(4)

print(original)  # Output: {1, 2, 3}
print(copied)    # Output: {1, 2, 3, 4}


# 8. union()
"""
Description:
Returns a new set containing all unique elements
from both sets.

Operator equivalent: |
"""

a = {1, 2, 3}
b = {3, 4, 5}

result = a.union(b)
# Alternative: result = a | b

print(result)  # Output: {1, 2, 3, 4, 5} (order may vary)
print(a)       # Output: {1, 2, 3}


# 9. intersection()
"""
Description:
Returns a new set containing only elements
that exist in both sets.

Operator equivalent: &
"""

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

result = a.intersection(b)
# Alternative: result = a & b

print(result)  # Output: {3, 4} (order may vary)


# 10. difference()
"""
Description:
Returns elements present in the first set
but not in the second set.

Operator equivalent: -
"""

a = {1, 2, 3, 4}
b = {3, 4, 5}

result = a.difference(b)
# Alternative: result = a - b

print(result)  # Output: {1, 2} (order may vary)


# 11. symmetric_difference()
"""
Description:
Returns elements present in either set,
but not in both sets.

Operator equivalent: ^
"""

a = {1, 2, 3}
b = {3, 4, 5}

result = a.symmetric_difference(b)
# Alternative: result = a ^ b

print(result)  # Output: {1, 2, 4, 5} (order may vary)


# 12. intersection_update()
"""
Description:
Updates the original set to keep only elements
that exist in both sets.
Does not return the resulting set.
"""

a = {1, 2, 3, 4}
b = {3, 4, 5}

a.intersection_update(b)

print(a)  # Output: {3, 4} (order may vary)


# 13. difference_update()
"""
Description:
Updates the original set by removing elements
that are present in the other set.
"""

a = {1, 2, 3, 4}
b = {3, 4, 5}

a.difference_update(b)

print(a)  # Output: {1, 2} (order may vary)


# 14. symmetric_difference_update()
"""
Description:
Updates the original set with elements that occur
in exactly one of the two sets.
"""

a = {1, 2, 3}
b = {3, 4, 5}

a.symmetric_difference_update(b)

print(a)  # Output: {1, 2, 4, 5} (order may vary)


# 15. issubset()
"""
Description:
Returns True if every element of one set
exists in another set.

Operator equivalent: <=
"""

a = {1, 2}
b = {1, 2, 3, 4}

print(a.issubset(b))  # Output: True
print(a <= b)         # Output: True


# 16. issuperset()
"""
Description:
Returns True if a set contains every element
of another set.

Operator equivalent: >=
"""

a = {1, 2, 3, 4}
b = {1, 2}

print(a.issuperset(b))  # Output: True
print(a >= b)           # Output: True


# 17. isdisjoint()
"""
Description:
Returns True if two sets have no common elements.
"""

a = {1, 2, 3}
b = {4, 5, 6}
c = {3, 4, 5}

print(a.isdisjoint(b))  # Output: True
print(a.isdisjoint(c))  # Output: False


# 18. len()
"""
Description:
Returns the number of unique elements in a set.
len() is a built-in Python function, not a set method.
"""

numbers = {10, 20, 20, 30}

print(len(numbers))  # Output: 3


# 19. Membership: in and not in
"""
Description:
Checks whether an element exists in a set.
Set membership checks are generally O(1) on average.
"""

numbers = {10, 20, 30}

print(20 in numbers)      # Output: True
print(40 in numbers)      # Output: False
print(40 not in numbers)  # Output: True


# 20. Convert a list to a set to remove duplicates
"""
Description:
A set stores unique elements.
Converting a list to a set removes duplicate values.
The original ordering is not guaranteed to be preserved.
"""

numbers = [1, 2, 2, 3, 3, 4, 4, 5]

unique_numbers = set(numbers)

print(unique_numbers)  # Output: {1, 2, 3, 4, 5} (order may vary)


# 21. Preserve order while removing duplicates
"""
Description:
If you want unique elements while preserving their
first appearance, use dict.fromkeys().
This returns a dictionary, so convert its keys to a list.
"""

numbers = [3, 1, 3, 2, 1, 4]

unique_numbers = list(dict.fromkeys(numbers))

print(unique_numbers)  # Output: [3, 1, 2, 4]


# 22. Set comprehension
"""
Description:
Creates a new set using an expression and optional condition.
Duplicate results are automatically removed.
"""

squares = {number ** 2 for number in range(1, 6)}

print(squares)  # Output: {1, 4, 9, 16, 25} (order may vary)


# 23. Filter a set using set comprehension
"""
Description:
Creates a set containing only elements that satisfy
a condition.
"""

numbers = {1, 2, 3, 4, 5, 6}

even_numbers = {number for number in numbers if number % 2 == 0}

print(even_numbers)  # Output: {2, 4, 6} (order may vary)


# 24. Find common elements between two lists
"""
Description:
Convert lists to sets and use intersection()
to find unique common elements.
"""

users_online = ["alice", "bob", "charlie", "alice"]
users_paid = ["bob", "david", "alice"]

common_users = set(users_online) & set(users_paid)

print(common_users)  # Output: {'alice', 'bob'} (order may vary)


# 25. Find missing permissions
"""
Description:
Use difference() to find permissions that a user
does not have.
"""

required_permissions = {"read", "write", "delete"}
user_permissions = {"read", "write"}

missing_permissions = required_permissions - user_permissions

print(missing_permissions)  # Output: {'delete'}


# 26. Remove multiple elements using difference_update()
"""
Description:
Removes all specified elements from the original set.
Useful when excluding several values at once.
"""

numbers = {1, 2, 3, 4, 5}
numbers.difference_update({2, 4})

print(numbers)  # Output: {1, 3, 5} (order may vary)


# 27. Empty set vs empty dictionary
"""
Description:
Use set() to create an empty set.
Using {} creates an empty dictionary, not a set.
"""

empty_set = set()
empty_dictionary = {}

print(type(empty_set))        # Output: <class 'set'>
print(type(empty_dictionary))  # Output: <class 'dict'>


# 28. Set elements must be hashable
"""
Description:
Set elements must be hashable, which normally includes
strings, numbers, and tuples containing hashable values.
Lists and dictionaries cannot be set elements.
"""

valid_set = {1, "hello", (10, 20)}

print(valid_set)  # Output: Contains 1, 'hello', and (10, 20)

# invalid_set = {[1, 2], 3}  # Raises TypeError: unhashable type: 'list'


# 29. Sets do not support indexing
"""
Description:
Sets are unordered collections and do not support
index-based access like lists.
"""

numbers = {10, 20, 30}

# print(numbers[0])  # Raises TypeError: 'set' object is not subscriptable

# If you need index-based access, convert to a list.
numbers_list = list(numbers)

print(len(numbers_list))  # Output: 3


# 30. Update a set using |=
"""
Description:
The |= operator updates the existing set with the union
of another set.
"""

a = {1, 2}
b = {2, 3}

a |= b

print(a)  # Output: {1, 2, 3} (order may vary)


# ============================================
# End of set_methods.py
# ============================================
