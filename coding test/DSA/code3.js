//Given two strings s and t, return true if t is an anagram of s, and false otherwise.

//Example 1:
// Input: s = "anagram", t = "nagaram"
// Output: true
// Example 2:
// Input: s = "rat", t = "car"
// Output: false

function isAnagramMap(str1, str2) {
  const cleanStr1 = str1.replace(/[^\w]/g, "").toLowerCase();
  const cleanStr2 = str2.replace(/[^\w]/g, "").toLowerCase();

  if (cleanStr1.length !== cleanStr2.length) return false;

  const charCount = {};

  // Count characters in the first string
  for (let char of cleanStr1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Subtract counts using the second string
  for (let char of cleanStr2) {
    if (!charCount[char]) {
      return false; // Character missing or extra
    }
    charCount[char]--;
  }

  return true;
}

//"The time complexity is O(n + m) because I scan both strings a constant number of times. The space complexity is O(n + m) in this implementation because I create cleaned strings and a frequency map. If the character set is fixed, the frequency map itself is O(1) space."