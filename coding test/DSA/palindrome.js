//return the longest (maximum length) palindrome substring from a string using a custom loop in JavaScript, here’s a clean and interview-ready solution.

function longestPalindrome(s) {
  let max = "";

  function isPalindrome(str) {
    for (let i = 0; i < str.length / 2; i++) {
      if (str[i] !== str[str.length - 1 - i]) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      let substr = s.substring(i, j);
      if (isPalindrome(substr) && substr.length > max.length) {
        max = substr;
      }
    }
  }

  return max;
}

// Example
console.log(longestPalindrome("babad")); // "bab" or "aba"
console.log(longestPalindrome("cbbd")); // "bb"
console.log(longestPalindrome("forgeeksskeegfor")); // "geeksskeeg"
console.log(longestPalindrome("aa")); // "geeksskeeg"
