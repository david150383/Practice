
def char_h1(string: str) -> int:
    if len(string) < 2:
        return 0

    if string[:3] == "xhi":
        return char_h1(string[3:])

    if string[:2] == "hi":
        return 1 + char_h1(string[2:])

    return char_h1(string[1:])


print(char_h1("ashis3hi34xhisfxhi"))
# Output: 2
