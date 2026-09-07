// Given: An array of integers nums and an integer target.
// Task: Return the indices of the two numbers such that they sum to target.
// Assumptions: Each input has exactly one solution, and you may not use the same element twice.
// Example 1:
// nums = [2, 7, 11, 15], target = 9
// Output: [0, 1] because nums[0] + nums[1] == 9.
// Example 2:
// nums = [3, 2, 4], target = 6
// Output: [1, 2] because nums[1] + nums[2] == 6.

//if numbers will be in squence
function twoSum(numbers, target) {
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] + numbers[i + 1] === target) {
      return [i, i + 1];
    }
  }
  return false;
}

//if numbers can be in any squence
function twoSum2(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target && i !== j) {
        return [i, j];
      }
    }
  }
  return false;
}
console.log(twoSum2([2, 11, 7, 15], 9));
