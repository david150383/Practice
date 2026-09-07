function isPared(str) {
  let length = str.length;
  let stack = [];
  const bracketPairs = {
    // Map closing brackets to their opening counterparts
    ")": "(",
    "}": "{",
    "]": "[",
  };
  for (let i = 0; i < length; i++) {
    if (Object.values(bracketPairs).includes(str[i])) {
      // str[i] === '('
      stack.push(str[i]);
    } else if (bracketPairs[str[i]]) {
      //// str[i] === ')'
      let lastOpen = stack.pop();
      if (lastOpen !== bracketPairs[str[i]]) {
        //// ')' === ')'
        return false;
      }
    }
  }
  return stack.length === 0;
}

console.log(isPared("({2+3}*4)"));
