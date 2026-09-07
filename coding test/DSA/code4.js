//javascript [-4,-1,0,2,10] should return a sorted order with square like 0,1,4,16 100

const numbers = [-4, -1, 0, 2, 10];

const sortedSquares = numbers.map(num => num ** 2).sort((a, b) => a - b);

console.log(sortedSquares); // [0, 1, 4, 16, 100]


//Optimized Two-Pointer Approach (O(n) Time)The standard sort() method takes O(n log n) time. Because the original array is already sorted, you can use a two-pointer approach to achieve O(n) time complexity. This avoids a heavy sorting step.

function sortedSquares2(arr) {
    const result = new Array(arr.length);
    let left = 0;
    let right = arr.length - 1;
    let position = arr.length - 1;

    while (left <= right) {
        const leftSquare = arr[left] ** 2;
        const rightSquare = arr[right] ** 2;

        if (leftSquare > rightSquare) {
            result[position] = leftSquare;
            left++;
        } else {
            result[position] = rightSquare;
            right--;
        }
        position--;
    }

    return result;
}

console.log(sortedSquares2([-4, -1, 0, 2, 10])); // [0, 1, 4, 16, 100]