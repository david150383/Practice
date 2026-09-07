function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      // Check for divisibility by both 3 and 5 (15) first
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      // Check for divisibility by 3
      console.log("Fizz");
    } else if (i % 5 === 0) {
      // Check for divisibility by 5
      console.log("Buzz");
    } else {
      // Otherwise, print the number
      console.log(i);
    }
  }
}

// Example usage:
fizzBuzz(100);
