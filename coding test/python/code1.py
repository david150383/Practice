
import re


def codeland_username_validation(username: str) -> bool:
    length = len(username)

    if length < 4 or length > 25:
        return False

    if username.endswith("_"):
        return False

    # Check that the username starts with an English letter.
    if not re.match(r"^[A-Za-z]", username):
        return False

    # Check that only letters, digits, and underscores are allowed.
    if not re.fullmatch(r"[A-Za-z0-9_]+", username):
        return False

    return True


# Test cases
print(codeland_username_validation("aa_"))                 # False
print(codeland_username_validation("u__hello_world123"))   # True
print(codeland_username_validation("john123"))             # True
print(codeland_username_validation("_john"))                # False
print(codeland_username_validation("john@123"))             # False
print(codeland_username_validation("abc"))                  # False
print(codeland_username_validation("a" * 26))               # False
