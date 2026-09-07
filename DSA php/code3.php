<?php
//Given two strings s and t, return true if t is an anagram of s, and false otherwise.

//Example 1:
// Input: s = "anagram", t = "nagaram"
// Output: true
// Example 2:
// Input: s = "rat", t = "car"
// Output: false

function isAnagramMap($str1, $str2) {
$map = [];
if (strlen($str1) !== strlen($str2)) {
    return false;
}
for($i=0; $i<strlen($str1); $i++) {
    $map[$str1[$i]] = ($map[$str1[$i]] ?? 0) + 1;
}

for($i=0; $i<strlen($str2); $i++) {
    if(!$map[$str2[$i]]) {
        return false;
    }
    $map[$str2[$i]]--;
}
return true;

}
echo isAnagramMap("anagram", "nagaram");
//"The time complexity is O(n + m) because I scan both strings a constant number of times. The space complexity is O(n + m) in this implementation because I create cleaned strings and a frequency map. If the character set is fixed, the frequency map itself is O(1) space."
?>