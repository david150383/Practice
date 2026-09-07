// create a new accending sorted array without using sort method
const a1 = [2, 4, 5, 8];
const a2 = [1, 3, 7, 9];

let i = 0;
let j = 0;
const result = [];

while (i < a1.length && j < a2.length) {
  if (a1[i] <= a2[j]) {
    result.push(a1[i]);
    i++;
  } else {
    result.push(a2[j]);
    j++;
  }
}

// Add remaining elements from a1
while (i < a1.length) {
  result.push(a1[i]);
  i++;
}

// Add remaining elements from a2
while (j < a2.length) {
  result.push(a2[j]);
  j++;
}

console.log(result);
//Time: O(n + m)
//Space: O(n + m) for the output array
