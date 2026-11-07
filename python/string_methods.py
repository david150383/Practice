# ============================================
# Python String Methods
# File: string_methods.py
# ============================================


# 1. upper()
"""
Description:
Converts all alphabetic characters to uppercase.
Strings are immutable, so the original is unchanged.
"""

text = "hello python"

print(text.upper())  # Output: HELLO PYTHON
print(text)          # Output: hello python


# 2. lower()
"""
Description:
Converts all alphabetic characters to lowercase.
"""

text = "HELLO PYTHON"

print(text.lower())  # Output: hello python


# 3. capitalize()
"""
Description:
Capitalizes the first character and lowercases
the remaining characters.
"""

text = "hELLO PYTHON"

print(text.capitalize())  # Output: Hello python


# 4. title()
"""
Description:
Capitalizes the first character of each word.
"""

text = "learn python programming"

print(text.title())  # Output: Learn Python Programming


# 5. swapcase()
"""
Description:
Converts uppercase characters to lowercase
and lowercase characters to uppercase.
"""

text = "Hello PYTHON"

print(text.swapcase())  # Output: hELLO python


# 6. strip()
"""
Description:
Removes whitespace from both ends of a string.
It does not remove whitespace from the middle.
"""

text = "   hello python   "

print(text.strip())  # Output: hello python


# 7. lstrip() and rstrip()
"""
Description:
lstrip() removes whitespace from the left.
rstrip() removes whitespace from the right.
"""

text = "   hello   "

print(text.lstrip())  # Output: hello
print(text.rstrip())  # Output:    hello


# 8. replace()
"""
Description:
Replaces occurrences of one substring with another.
An optional third argument limits the number of replacements.
"""

text = "apple banana apple"

print(text.replace("apple", "orange"))
# Output: orange banana orange

print(text.replace("apple", "orange", 1))
# Output: orange banana apple


# 9. split()
"""
Description:
Splits a string into a list.
Without an argument, consecutive whitespace is treated
as a single separator.
"""

text = "python javascript typescript"

print(text.split())
# Output: ['python', 'javascript', 'typescript']

text = "apple,banana,orange"

print(text.split(","))
# Output: ['apple', 'banana', 'orange']


# 10. join()
"""
Description:
Joins strings from an iterable using a separator.
The separator is placed between each element.
All elements must be strings.
"""

languages = ["Python", "JavaScript", "TypeScript"]

print(", ".join(languages))
# Output: Python, JavaScript, TypeScript

print("-".join(languages))
# Output: Python-JavaScript-TypeScript


# 11. find()
"""
Description:
Returns the index of the first occurrence of a substring.
Returns -1 if the substring is not found.
"""

text = "hello python"

print(text.find("python"))  # Output: 6
print(text.find("java"))    # Output: -1


# 12. index()
"""
Description:
Like find(), but raises ValueError when the substring
does not exist.
"""

text = "hello python"

print(text.index("python"))  # Output: 6

# print(text.index("java"))  # Raises ValueError


# 13. count()
"""
Description:
Counts non-overlapping occurrences of a substring.
"""

text = "banana"

print(text.count("a"))   # Output: 3
print(text.count("ana"))  # Output: 1


# 14. startswith()
"""
Description:
Checks whether a string starts with a specified prefix.
"""

filename = "report.pdf"

print(filename.startswith("report"))  # Output: True
print(filename.startswith("image"))   # Output: False


# 15. endswith()
"""
Description:
Checks whether a string ends with a specified suffix.
"""

filename = "report.pdf"

print(filename.endswith(".pdf"))  # Output: True
print(filename.endswith(".png"))  # Output: False


# 16. isalpha()
"""
Description:
Returns True if all characters are alphabetic
and the string is not empty.
"""

print("Python".isalpha())  # Output: True
print("Python3".isalpha())  # Output: False
print("".isalpha())        # Output: False


# 17. isdigit()
"""
Description:
Returns True if all characters are digits
and the string is not empty.
Some Unicode digit characters are accepted.
"""

print("12345".isdigit())  # Output: True
print("123abc".isdigit())  # Output: False
print("-123".isdigit())   # Output: False


# 18. isdecimal()
"""
Description:
Returns True if all characters are decimal characters
and the string is not empty.
It is narrower than isdigit().
"""

print("12345".isdecimal())  # Output: True
print("12.5".isdecimal())   # Output: False


# 19. isnumeric()
"""
Description:
Returns True if all characters are numeric characters
and the string is not empty.
It accepts some numeric characters that isdigit()
and isdecimal() do not.
"""

print("12345".isnumeric())  # Output: True
print("12.5".isnumeric())   # Output: False


# 20. isalnum()
"""
Description:
Returns True if every character is alphabetic
or numeric and the string is not empty.
"""

print("Python123".isalnum())  # Output: True
print("Python 123".isalnum())  # Output: False
print("Python!".isalnum())    # Output: False


# 21. isspace()
"""
Description:
Checks whether all characters are whitespace.
An empty string returns False.
"""

print("   ".isspace())  # Output: True
print(" a ".isspace())  # Output: False
print("".isspace())     # Output: False


# 22. islower() and isupper()
"""
Description:
Check whether cased characters are lowercase or uppercase.
Strings without any cased characters return False.
"""

print("hello".islower())  # Output: True
print("HELLO".isupper())  # Output: True
print("Hello".islower())  # Output: False


# 23. istitle()
"""
Description:
Checks whether each word follows title-case rules.
"""

print("Hello World".istitle())  # Output: True
print("hello world".istitle())  # Output: False


# 24. len()
"""
Description:
Returns the number of Unicode code points in a string.
len() is a built-in function, not a string method.
"""

text = "Python"

print(len(text))  # Output: 6


# 25. String slicing
"""
Description:
Extracts part of a string using [start:stop:step].
The stop index is excluded.
"""

text = "Python"

print(text[0:2])  # Output: Py
print(text[2:])   # Output: thon
print(text[:4])   # Output: Pyth
print(text[::-1])  # Output: nohtyP


# 26. String indexing
"""
Description:
Accesses a character by position.
Negative indexes count from the end.
"""

text = "Python"

print(text[0])   # Output: P
print(text[-1])  # Output: n


# 27. f-strings
"""
Description:
Embed expressions directly inside strings.
Similar to JavaScript template literals.
"""

name = "Alice"
age = 30

print(f"My name is {name} and I am {age}")
# Output: My name is Alice and I am 30


# 28. format()
"""
Description:
Inserts values into placeholders.
Useful when building formatted strings.
"""

name = "Alice"
age = 30

print("Name: {}, Age: {}".format(name, age))
# Output: Name: Alice, Age: 30

print("Name: {name}, Age: {age}".format(name=name, age=age))
# Output: Name: Alice, Age: 30


# 29. zfill()
"""
Description:
Pads a string on the left with zeros until it reaches
the specified width.
"""

number = "42"

print(number.zfill(5))  # Output: 00042


# 30. center(), ljust(), and rjust()
"""
Description:
center() centers a string within a specified width.
ljust() aligns it left.
rjust() aligns it right.
"""

text = "Python"

print(text.center(10, "-"))  # Output: --Python--
print(text.ljust(10, "-"))   # Output: Python----
print(text.rjust(10, "-"))   # Output: ----Python


# 31. partition()
"""
Description:
Splits a string into a 3-element tuple:
text before the first separator, separator, and text after it.
If the separator is missing, the last two elements are empty.
"""

text = "name=Alice"

print(text.partition("="))
# Output: ('name', '=', 'Alice')


# 32. rpartition()
"""
Description:
Like partition(), but searches for the last occurrence
of the separator.
"""

text = "a-b-c"

print(text.rpartition("-"))
# Output: ('a-b', '-', 'c')


# 33. removeprefix()
"""
Description:
Removes the specified prefix if it exists.
Otherwise, returns the original string.
Available in Python 3.9 and later.
"""

text = "prefix_data"

print(text.removeprefix("prefix_"))
# Output: data


# 34. removesuffix()
"""
Description:
Removes the specified suffix if it exists.
Otherwise, returns the original string.
Available in Python 3.9 and later.
"""

filename = "report.pdf"

print(filename.removesuffix(".pdf"))
# Output: report


# 35. splitlines()
"""
Description:
Splits a string at line boundaries.
"""

text = "Python\nJavaScript\nTypeScript"

print(text.splitlines())
# Output: ['Python', 'JavaScript', 'TypeScript']


# 36. casefold()
"""
Description:
Converts a string to a form suitable for caseless comparison.
It is more aggressive than lower() for some Unicode text.
"""

a = "Python"
b = "PYTHON"

print(a.casefold() == b.casefold())  # Output: True


# 37. expandtabs()
"""
Description:
Replaces tab characters with spaces.
The default tab size is 8.
"""

text = "A\tB"

print(text.expandtabs(4))  # Output: A   B


# 38. encode()
"""
Description:
Encodes a string into bytes using a specified encoding.
UTF-8 is commonly used for APIs and web applications.
"""

text = "hello"

result = text.encode("utf-8")

print(result)         # Output: b'hello'
print(type(result))   # Output: <class 'bytes'>


# 39. Check substring membership
"""
Description:
Use in or not in to check whether a substring exists.
This is an operator, not a string method.
"""

text = "Python is great"

print("Python" in text)      # Output: True
print("JavaScript" in text)  # Output: False


# 40. Strings are immutable
"""
Description:
String methods return new strings rather than modifying
the original string in place.
"""

text = "hello"

result = text.upper()

print(text)    # Output: hello
print(result)  # Output: HELLO


# 41. Practical example: normalize user input
"""
Description:
strip() removes surrounding whitespace.
lower() normalizes case for comparison.
Useful for handling input such as role names or status values.
"""

role = "  ADMIN  "

normalized_role = role.strip().lower()

print(normalized_role)  # Output: admin
print(normalized_role == "admin")  # Output: True


# 42. Practical example: validate an email-like string
"""
Description:
Demonstrates basic string checks only.
This is not a complete email validation strategy.
Use proper validation rules or a library for production.
"""

email = "user@example.com"

is_valid_format = (
    email.count("@") == 1
    and not email.startswith("@")
    and not email.endswith("@")
    and " " not in email
)

print(is_valid_format)  # Output: True


# ============================================
# End of string_methods.py
# ============================================
