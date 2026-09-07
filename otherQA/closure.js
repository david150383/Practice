function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// MultiplyBy
function multiplyBy(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const multiplyBy2 = multiplyBy(2);
const multiplyBy5 = multiplyBy(5);

console.log(multiplyBy2(10)); // 20
console.log(multiplyBy2(2)); // 4
console.log(multiplyBy5(10)); // 50
