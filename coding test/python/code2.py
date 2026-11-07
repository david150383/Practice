
def find_intersection(str_arr: list[str]) -> str:
    a = list(map(int, str_arr[0].split(", ")))
    b = list(map(int, str_arr[1].split(", ")))

    i = 0
    j = 0
    result = []

    while i < len(a) and j < len(b):
        if a[i] == b[j]:
            result.append(a[i])
            i += 1
            j += 1
        elif a[i] < b[j]:
            i += 1
        else:
            j += 1

    return ",".join(map(str, result))


print(find_intersection([
    "1, 3, 4, 7, 13",
    "1, 2, 4, 13, 15"
]))

# Output: 1,4,13
