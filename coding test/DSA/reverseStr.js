function reverseString(str) {
  let length = str.length - 1;
  let reverse = "";
  for (let i = length; i >= 0; i--) {
    reverse += str[i];
  }
  return reverse;
}

function reverseString2(str) {
  return str.split("").reverse().join("");
}

console.log(reverseString2("test string"));
