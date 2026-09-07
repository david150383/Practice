function powerSet(arr) {
  const result = [[]];
  for (let value of arr) {
    let currentLength = result.length;
    for (let i = 0; i < currentLength; i++) {
      result.push([...result[i], value]);
    }
  }
  return result;
}

const res = powerSet([1, 2, 3]);
for (const subset of res) {
  console.log("[" + subset.join(", ") + "]");
}