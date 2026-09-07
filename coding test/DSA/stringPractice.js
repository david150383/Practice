//4. Count Vowels in a String

function countVowels(str) {
  return (str.match(/[aeiou]/gi) || []).length;
}
console.log(countVowels("rashid"));

//5. Find First Non-Repeating Character

function firstUniqueChar(str) {
  const map = {};

  for (let char of str) {
    map[char] = (map[char] || 0) + 1;
  }

  for (let char of str) {
    if (map[char] === 1) return char;
  }

  return null;
}
console.log(firstUniqueChar("asdasdbtb"));

//6. Find the Longest Word in a Sentence
function longestWord(sentence) {
  return sentence
    .split(" ")
    .reduce(
      (longest, word) => (word.length > longest.length ? word : longest),
      "",
    );
}
console.log(longestWord("My name is rashid khan"));

//7. Capitalize First Letter of Each Word
function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

console.log(capitalizeWords("My name is rashid khan"));

//8. Check if String Contains Only Digits
function isNumeric(str) {
  return /^\d+$/.test(str);
}

console.log(isNumeric("32342343s"));
console.log(isNumeric("32342343"));

//9. Implement indexOf() Manually
function customIndexOf(str, search) {
  for (let i = 0; i <= str.length - search.length; i++) {
    if (str.substring(i, i + search.length) === search) {
      return i;
    }
  }
  return -1;
}

console.log(customIndexOf("rashid", "h"));

//10. Find All Substrings of a String

function getSubstrings(str) {
  const result = [];

  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      result.push(str.slice(i, j));
    }
  }

  return result;
}

console.log(getSubstrings("rashid"));

//11. String Compression (e.g., "aaabb" → "a3b2")
function compressString(str) {
  let compressed = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      compressed += str[i] + count;
      count = 1;
    }
  }

  return compressed;
}
console.log(compressString("aaabcc"));
