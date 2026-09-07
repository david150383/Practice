//.sort() already sorts strings lexicographically by default.

let numbers = [5, 3, 6, 8, 1, 2, 4];
numbers.sort((a, b) => a - b);
console.log(numbers);

let strings = ["a", "c", "b"];
strings.sort();
console.log(strings);

let string = "zhax";
let sortedString = string.split("").sort().join("");
console.log(sortedString);

function sortArray(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (arr[i] < arr[j]) {
        let backup = arr[j];
        arr[j] = arr[i];
        arr[i] = backup;
      }
    }
  }
  return arr;
}
console.log("+++++++++++sortArray+++++++++++++");
console.log(sortArray([5, 3, 6, 8, 1, 2, 4]));

//sort array by object key
const people = [
  { firstName: "John", lastName: "Smith" },
  { firstName: "Alice", lastName: "Johnson" },
  { firstName: "Bob", lastName: "Brown" },
];
people.sort((a, b) => a.lastName.localeCompare(b.lastName));
console.log(people);
