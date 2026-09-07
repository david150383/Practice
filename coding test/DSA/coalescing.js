/*In JavaScript, || (logical OR) and ?? (nullish coalescing) can look similar, but they behave differently in an important way.
//|| returns the first truthy value.

That means if the left side is falsy, it will return the right side.

Falsy values in JavaScript include:

false
0
"" (empty string)
NaN
null
undefined

Example:
*/
let value = 0 || 10;
console.log(value); // 10
//Even though 0 might be a valid value, it's falsy, so 10 is returned.

/*
?? (Nullish Coalescing)

?? returns the first defined (non-nullish) value.

It only treats these as “empty”:

null
undefined

Example:
*/
let value = 0 ?? 10;
console.log(value); // 0

/*Here, 0 is not null or undefined, so it’s kept.

Key Difference
|| → checks for falsy
?? → checks for null or undefined only

Side-by-side examples
*/
"" || "default"; // "default"
"" ?? "default"; // ""

false || true; // true
false ?? true; // false

null || "x"; // "x"
null ?? "x"; // "x"

undefined || "x"; // "x"
undefined ?? "x"; // "x"
