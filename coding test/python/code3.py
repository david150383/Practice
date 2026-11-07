
import re


def is_anagram_map(str1: str, str2: str) -> bool:
    clean_str1 = re.sub(r"[^\w]", "", str1).lower()
    clean_str2 = re.sub(r"[^\w]", "", str2).lower()

    if len(clean_str1) != len(clean_str2):
        return False

    char_count = {}

    # Count characters in the first string
    for char in clean_str1:
        char_count[char] = char_count.get(char, 0) + 1

    # Subtract counts using the second string
    for char in clean_str2:
        if char_count.get(char, 0) == 0:
            return False  # Character missing or extra

        char_count[char] -= 1

    return True


# Test cases
print(is_anagram_map("listen", "silent"))                 # True
print(is_anagram_map("hello", "world"))                   # False
print(is_anagram_map("Dormitory", "Dirty room"))          # True
print(is_anagram_map("Astronomer", "Moon starer"))        # True
print(is_anagram_map("aabb", "abbb"))                     # False
