
# Create a new ascending sorted list without using sort()

a1 = [2, 4, 5, 8]
a2 = [1, 3, 7, 9]

i = 0
j = 0
result = []

while i < len(a1) and j < len(a2):
    if a1[i] <= a2[j]:
        result.append(a1[i])
        i += 1
    else:
        result.append(a2[j])
        j += 1

# Add remaining elements from a1
while i < len(a1):
    result.append(a1[i])
    i += 1

# Add remaining elements from a2
while j < len(a2):
    result.append(a2[j])
    j += 1

print(result)

# Output: [1, 2, 3, 4, 5, 7, 8, 9]

# Time: O(n + m)
# Space: O(n + m) for the output list
