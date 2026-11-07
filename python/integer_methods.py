# ============================================
# Python Integer Operations and Built-in Functions
# File: integer_methods.py
# ============================================


# 1. Basic arithmetic operations
"""
Description:
Python supports addition, subtraction, multiplication,
division, floor division, modulo, and exponentiation.

JavaScript equivalents:
+, -, *, /, %, **
Python uses // for floor division.
"""

a = 10
b = 3

print(a + b)   # Output: 13
print(a - b)   # Output: 7
print(a * b)   # Output: 30
print(a / b)   # Output: 3.3333333333333335
print(a // b)  # Output: 3
print(a % b)   # Output: 1
print(a ** b)  # Output: 1000


# 2. abs()
"""
Description:
Returns the absolute value of a number.
Removes the negative sign if present.
"""

number = -25

print(abs(number))  # Output: 25


# 3. round()
"""
Description:
Rounds a number to a specified number of decimal places.
Python uses round-to-even for exact halfway cases.
"""

print(round(3.14159))     # Output: 3
print(round(3.14159, 2))  # Output: 3.14
print(round(2.5))         # Output: 2
print(round(3.5))         # Output: 4


# 4. pow()
"""
Description:
Raises a number to a power.
Similar to the ** operator.
"""

print(pow(2, 3))  # Output: 8
print(2 ** 3)     # Output: 8


# 5. divmod()
"""
Description:
Returns a tuple containing the quotient and remainder.
Equivalent to (a // b, a % b).
"""

result = divmod(17, 5)

print(result)     # Output: (3, 2)
print(result[0])  # Output: 3
print(result[1])  # Output: 2


# 6. max() and min()
"""
Description:
Return the largest and smallest values.
These are built-in functions, not integer methods.
"""

numbers = [10, 5, 30, 15]

print(max(numbers))  # Output: 30
print(min(numbers))  # Output: 5


# 7. sum()
"""
Description:
Returns the sum of values in an iterable.
"""

numbers = [10, 20, 30]

print(sum(numbers))  # Output: 60


# 8. int()
"""
Description:
Converts compatible values to integers.
For a float, the fractional part is truncated toward zero.
For a string, the text must represent an integer.
"""

print(int("123"))   # Output: 123
print(int(12.99))   # Output: 12
print(int(-12.99))  # Output: -12
print(int(True))    # Output: 1
print(int(False))   # Output: 0


# 9. Integer conversion from different bases
"""
Description:
int(string, base) converts a string from a specified
number base into a decimal integer.
"""

print(int("1010", 2))   # Output: 10
print(int("17", 8))     # Output: 15
print(int("FF", 16))    # Output: 255


# 10. bin(), oct(), and hex()
"""
Description:
Convert an integer to binary, octal, or hexadecimal
string representations.
"""

number = 255

print(bin(number))  # Output: 0b11111111
print(oct(number))  # Output: 0o377
print(hex(number))  # Output: 0xff


# 11. bit_length()
"""
Description:
Returns the number of bits required to represent
the absolute value of an integer, excluding the sign
and leading zeros.
"""

print((10).bit_length())   # Output: 4
print((255).bit_length())  # Output: 8
print((0).bit_length())    # Output: 0


# 12. bit_count()
"""
Description:
Returns the number of 1 bits in the binary
representation of the absolute value.
Available in Python 3.10 and later.
"""

print((7).bit_count())   # Output: 3; binary: 111
print((10).bit_count())  # Output: 2; binary: 1010


# 13. is_integer() difference between float and int
"""
Description:
is_integer() is a float method, not an integer method.
It checks whether a float has no fractional part.
"""

print((5.0).is_integer())  # Output: True
print((5.2).is_integer())  # Output: False

# print((5).is_integer())  # Raises AttributeError


# 14. isinstance()
"""
Description:
Checks whether a value is an instance of a type.
In Python, bool is a subclass of int.
"""

print(isinstance(10, int))    # Output: True
print(isinstance(10.5, int))  # Output: False
print(isinstance(True, int))  # Output: True


# 15. Integer division and negative numbers
"""
Description:
Python // rounds down toward negative infinity.
This differs from JavaScript's Math.trunc(a / b)
for negative, non-divisible values.
"""

print(7 // 3)    # Output: 2
print(-7 // 3)   # Output: -3
print(-7 % 3)    # Output: 2


# 16. Large integers
"""
Description:
Python integers can grow beyond 32-bit and 64-bit
integer ranges, limited by available memory.
JavaScript Number cannot exactly represent every
integer larger than 2**53 - 1.
"""

number = 10 ** 100

print(number > 0)  # Output: True
print(len(str(number)))  # Output: 101


# 17. Numeric comparisons
"""
Description:
Python supports standard comparison operators.
Comparison expressions return True or False.
"""

a = 10
b = 20

print(a == b)  # Output: False
print(a != b)  # Output: True
print(a < b)   # Output: True
print(a > b)   # Output: False
print(a <= b)  # Output: True
print(a >= b)  # Output: False


# 18. Chained comparisons
"""
Description:
Python allows multiple comparisons in one expression.
Equivalent to checking both comparisons with AND.
"""

age = 25

print(18 <= age <= 60)  # Output: True

# Equivalent to:
print(18 <= age and age <= 60)  # Output: True


# 19. Integer formatting
"""
Description:
format() can represent integers using different
number bases and formatting options.
"""

number = 255

print(format(number, "b"))  # Output: 11111111
print(format(number, "o"))  # Output: 377
print(format(number, "x"))  # Output: ff
print(format(number, ","))  # Output: 255


# 20. Check whether an integer is even or odd
"""
Description:
The modulo operator checks the remainder after division.
A remainder of zero means the integer is even.
"""

number = 14

print(number % 2 == 0)  # Output: True

number = 15

print(number % 2 != 0)  # Output: True


# ============================================
# End of integer_methods.py
# ============================================
