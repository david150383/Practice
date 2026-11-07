# Python `set` methods cheat sheet

A Python `set` is a collection of unique values. If you're coming from JavaScript, think of it as the equivalent of JavaScript's `Set`.

The main differences: Python sets use `{}` for non-empty sets, and they support convenient mathematical operations such as union, intersection, and difference.

## 1. Common methods at a glance

| Python method            | Purpose                                            | JavaScript equivalent     |
| ------------------------ | -------------------------------------------------- | ------------------------- |
| `add()`                  | Add one value                                      | `set.add()`               |
| `update()`               | Add multiple values                                | Loop and call `set.add()` |
| `remove()`               | Remove a value; errors if missing                  | `set.delete()` differs    |
| `discard()`              | Remove if present; no error if missing             | `set.delete()`            |
| `pop()`                  | Remove and return an arbitrary element             | No exact equivalent       |
| `clear()`                | Remove all values                                  | `set.clear()`             |
| `copy()`                 | Shallow copy                                       | `new Set(set)`            |
| `union()`                | Combine unique values                              | Spread + `new Set()`      |
| `intersection()`         | Common values                                      | No built-in method        |
| `difference()`           | Values present only in the first set               | No built-in method        |
| `symmetric_difference()` | Values present in either set, but not both         | No built-in method        |
| `issubset()`             | Check whether all values belong to another set     | No built-in method        |
| `issuperset()`           | Check whether another set's values are all present | No built-in method        |
| `isdisjoint()`           | Check whether sets share no values                 | No built-in method        |

## 2. Creating a set

```
numbers = {1, 2, 3, 3, 4}print(numbers)# {1, 2, 3, 4}
```

Duplicates are automatically removed.

An empty set must be created using `set()`:

```
items = set()  # Empty setdata = {}      # Empty dictionary, NOT a set
```

JavaScript:

```
const numbers = new Set([1, 2, 3, 3, 4]);
// Set(4) {1, 2, 3, 4}
```

## 3. `add()` — add one element

```
skills = {"Python", "JavaScript"}skills.add("TypeScript")skills.add("Python")  # Duplicate; no changeprint(skills)# Contains Python, JavaScript, TypeScript
```

JavaScript equivalent:

```
skills.add("TypeScript");
```

## 4. `update()` — add multiple elements

```
skills = {"Python", "JavaScript"}skills.update(["Go", "Java", "Python"])print(skills)# Contains Python, JavaScript, Go, Java
```

You can pass any iterable, including a list, tuple, or another set.

JavaScript equivalent:

```
for (const skill of ["Go", "Java", "Python"]) {
    skills.add(skill);
}
```

## 5. `remove()` vs `discard()`

This is an important Python difference.

```
skills = {"Python", "JavaScript"}skills.remove("Python")  # Removes Pythonskills.discard("Go")     # Does nothing; Go is missing
```

But this raises an exception:

```
skills.remove("Go")# KeyError: 'Go'
```

Remember:

- `remove()` raises `KeyError` when the element doesn't exist.
- `discard()` silently ignores a missing element.

JavaScript's `Set.delete()` behaves more like `discard()`:

```
skills.delete("Go"); // Returns false if missing
```

## 6. `pop()` — remove an element

```
numbers = {10, 20, 30}value = numbers.pop()print(value)    # An element removed from the setprint(numbers)  # The remaining elements
```

Unlike a list's `pop()`, a set's `pop()` does not remove an element by index. The element returned is arbitrary, so don't rely on which value it removes.

## 7. `clear()` and `copy()`

```
original = {1, 2, 3}duplicate = original.copy()duplicate.add(4)print(original)   # {1, 2, 3}print(duplicate)  # Contains 1, 2, 3, 4original.clear()print(original)  # set()
```

JavaScript equivalents:

```
const duplicate = new Set(original);
original.clear();
```

## 8. Set operations — the most useful feature

These methods are particularly helpful for interviews, data processing, and backend validation.

### Union — `union()`

Combine elements from both sets, removing duplicates.

## A

{1, 2, 3}

## B

{3, 4, 5}

A ∪ B

## {1, 2, 3, 4, 5}

```
a = {1, 2, 3}b = {3, 4, 5}print(a.union(b))print(a | b)  # Operator shortcut
```

### Intersection — `intersection()`

Return only elements present in both sets.

## {3}

```
print(a.intersection(b))print(a & b)
```

### Difference — `difference()`

Return elements in A that are not in B. The order of the sets matters.

## {1, 2}

```
print(a.difference(b))print(a - b)
```

### Symmetric difference — `symmetric_difference()`

Return elements that appear in either set, but not both.

## {1, 2, 4, 5}

```
print(a.symmetric_difference(b))print(a ^ b)
```

## 9. Subset, superset and disjoint checks

```
admin_permissions = {"read", "write", "delete"}user_permissions = {"read", "write"}print(user_permissions.issubset(admin_permissions))# Trueprint(admin_permissions.issuperset(user_permissions))# Trueprint(user_permissions.isdisjoint({"execute", "deploy"}))# True
```

- `issubset()` — are all my elements present in the other set?
- `issuperset()` — do I contain all elements of the other set?
- `isdisjoint()` — do we have no elements in common?

These are useful for checking permissions, feature flags, and access rules.

## 10. Practical backend example: find missing permissions

Suppose a user requests access to some API endpoints.

```
required_permissions = {"read", "write", "delete"}user_permissions = {"read", "write"}missing = required_permissions - user_permissionsif missing:    print("Missing permissions:", missing)# Missing permissions: {'delete'}
```

This is simpler than writing nested loops.

## 11. Remove duplicates from a list

A common interview question:

```
numbers = [1, 2, 2, 3, 4, 4, 5]unique_numbers = list(set(numbers))print(unique_numbers)# Contains 1, 2, 3, 4, 5
```

Important: The resulting list's order is not guaranteed. If you want to preserve the original order, use:

```
unique_numbers = list(dict.fromkeys(numbers))print(unique_numbers)# [1, 2, 3, 4, 5]
```

## 12. Quick interview practice

## Test your knowledge

4 of 4

1\. What happens when you add a duplicate value to a set?

It raises an error

The duplicate is ignored

It replaces the existing set

It creates a list

Not quite.

Sets contain unique elements, so adding an existing value does not change the set.

2\. Which method removes an element without raising an error if it is missing?

remove()

pop()

discard()

update()

Not quite.

discard() safely ignores missing elements; remove() raises KeyError.

3\. What is the result of {1, 2, 3} & {2, 3, 4}?

{1, 2, 3, 4}

{1}

{2, 3}

{1, 4}

Correct!

The & operator calculates the intersection: elements shared by both sets.

4\. Can you use a list as an element of a Python set?

Yes, always

No, lists are unhashable

Only if the list is empty

Only with add()

Correct!

Set elements must be hashable. A tuple containing only hashable values can be used instead.

### Score: 2/4

Try again

Would you like me to remind you to continue your Python learning with the next topic, tuples and unpacking, so you can keep progressing without having to remember to return to this chat?