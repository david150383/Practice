
def flatten(arr: list, depth: int) -> list:
    if depth == 0:
        return arr

    result = []

    for item in arr:
        if isinstance(item, list):
            result.extend(flatten(item, depth - 1))
        else:
            result.append(item)

    return result


arr = [1, [2, [3, [4, 5]]]]

print(flatten(arr, 1))
# Output: [1, 2, [3, [4, 5]]]

print(flatten(arr, 2))
# Output: [1, 2, 3, [4, 5]]

print(flatten(arr, 3))
# Output: [1, 2, 3, 4, 5]
