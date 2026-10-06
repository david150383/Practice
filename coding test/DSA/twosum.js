// Given: An array of integers nums and an integer target.
// Task: Return the indexes of the two numbers such that they sum to target.
// Assumptions: Each input has exactly one solution, and you may not use the same element twice.
// Example 1:
// nums = [2, 7, 11, 15], target = 9
// Output: [0, 1] because nums[0] + nums[1] == 9.
// Example 2:
// nums = [3, 2, 4], target = 6
// Output: [1, 2] because nums[1] + nums[2] == 6.


//if input is sorted use Two pointers Time O(n), Space O(1)
//if input is Unsorted use HashMap Time O(n), Space O(n)

//Two pointers 
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) {
      return [arr[left], arr[right]];
    }

    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}

console.log(twoSum([1, 2, 4, 6, 8, 9, 14], 10));
// [1, 9]

//Option 2 — HashMap for unsorted array

function twoSumHashMap(arr, target) {
  const map = new Map();

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(arr[i], i);
  }

  return [];
}

console.log(twoSumHashMap([3, 2, 4], 6));
// [1, 2]
