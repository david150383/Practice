def sorted_squares(arr: list[int]) -> list[int]:
    result = [0] * len(arr) # Create a list of fixed initial size

    left = 0
    right = len(arr) - 1
    position = len(arr) - 1

    while left <= right:
        left_square = arr[left] ** 2
        right_square = arr[right] ** 2

        if left_square > right_square:
            result[position] = left_square
            left += 1
        else:
            result[position] = right_square
            right -= 1

        position -= 1

    return result


print(sorted_squares([-4, -1, 0, 2, 10]))
# Output: [0, 1, 4, 16, 100]
