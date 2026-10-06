function powerSet(array) {
  const results = [[]];

  for (const value of array) {
    const currentLength = results.length;
    for (let i = 0; i < currentLength; i++) {
      results.push([...results[i], value]);
    }
  }

  return results;
}
const res = powerSet([1, 2, 3]);

for (const subset of res) {
  console.log("[" + subset.join(", ") + "]");
}

/*
Time Complexity: O(n × 2ⁿ)

This one is different from the previous problems because the number of subsets grows exponentially.

Space Complexity: O(n × 2ⁿ)

You are storing the entire power set:
*/