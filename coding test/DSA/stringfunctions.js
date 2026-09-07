/*============================
Basic String Methods
============================*/
// 1. length
let str1 = "Hello";
console.log(str1.length); // 5

// 2. toUpperCase()
// Converts to uppercase.
"hello".toUpperCase(); // "HELLO"

// 3. toLowerCase()
// Converts to lowercase.
"HELLO".toLowerCase(); // "hello"

/*============================
✂️ Extracting Parts of a String
============================*/
// 4. slice(start, end)
// Extracts part of a string.

let str = "JavaScript";
str.slice(0, 4); // "Java"
str.substring(0, 4); // "Java"
str.slice(4, 5); // "S"
str.substring(4, 5); // "S"
str.slice(-3); // "ipt"
str.slice(1, -2); // "avaScri"

// 5. substring(start, end)
// Similar to slice(no negative indexes).

str.substring(4, 10); // "Script"

/*============================
🔍 Searching in Strings
============================*/

// 6. includes()
// Checks if string contains something.

"Hello world".includes("world"); // true

// 7. indexOf()
// Returns index of first match.

"apple".indexOf("p"); // 1

// 8. lastIndexOf()
// Searches from the end.

"banana".lastIndexOf("a"); // 5

/*============================
🔁 Replacing & Modifying
============================*/

// 9. replace()
// Replaces first match.

"Hello World".replace("World", "JS"); // "Hello JS"

// 10. replaceAll()
// Replaces all matches.

"1-1-1".replaceAll("-", ":"); // "1:1:1"

/*============================
🧹 Trimming Spaces
============================*/

// 11. trim()
// Removes spaces from both ends.

"  hello  ".trim(); // "hello"

// 12. trimStart() / trimEnd()

"  hello".trimStart(); // "hello"
"hello  ".trimEnd(); // "hello"

/*============================
🔗 Combining & Splitting
============================*/
// 13. concat()
// Joins strings.

"Hello".concat(" ", "World"); // "Hello World"

// 14. split()
// Converts string to array.

"red,green,blue".split(",");
// ["red", "green", "blue"]

/*============================
🔄 Repeating & Padding
============================*/

// 15. repeat()
// Repeats a string.

"Hi ".repeat(3); // "Hi Hi Hi "

// 16. padStart() / padEnd()

"5".padStart(3, "0"); // "005"
"5".padEnd(3, "0"); // "500"

/*============================
🔤 Character Access
============================*/

// 17. charAt()
// Returns character at index.

"Hello".charAt(1); // "e"

// 18. charCodeAt()
// Returns Unicode value.

"A".charCodeAt(0); // 65

/*============================
✅ Bonus: Template Strings(Very Common)
============================*/
let name = "Alex";
let age = 25;

console.log(`My name is ${name} and I am ${age} years old.`);
