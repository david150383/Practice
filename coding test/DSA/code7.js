//flatten nested array

//const arr = [1, [2, [3, [4, 5]]]];

//depth 1
// [1, 2, [3, [4, 5]]]

//depth 2
// [1, 2, 3, [4, 5]]

//depth 3
// [1, 2, 3, 4, 5]

function flatten(arr, depth) {
  if (depth === 0) return arr;

  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }

    return result;
  }, []);
}

const arr = [1, [2, [3, [4, 5]]]];

console.log(flatten(arr, 1));
// [1, 2, 3, [4, 5]]


//Time: O(N) traversal, potentially O(N·D) due to repeated result-array copying. Space: O(N + D), where O(N) is the output/intermediate arrays and O(D) is the recursion stack.