In JavaScript, the most common way to check the type of a value is `typeof`, but **arrays and `null` are special cases**.

### 1. `typeof`

```javascript
typeof "hello"       // "string"
typeof 123           // "number"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof null          // "object"  ❌ special case
typeof {}            // "object"
typeof []            // "object"  ❌ array needs special check
typeof function() {} // "function"
```

So:

```javascript
const value = 123;

if (typeof value === "number") {
  console.log("It's a number");
}
```

---

### 2. Check if it's an Array

Use:

```javascript
Array.isArray(value)
```

Example:

```javascript
Array.isArray([1, 2, 3]);
// true

Array.isArray("hello");
// false

Array.isArray({});
// false
```

This is the **recommended way**.

---

### 3. Check if it's an Object

Be careful with:

```javascript
typeof value === "object"
```

because it returns `true` for:

```javascript
typeof {};
// "object"

typeof [];
// "object"

typeof null;
// "object"
```

If you specifically mean a normal object:

```javascript
function isPlainObject(value) {
  return value !== null &&
         typeof value === "object" &&
         !Array.isArray(value);
}
```

Example:

```javascript
isPlainObject({});
// true

isPlainObject([]);
// false

isPlainObject(null);
// false

isPlainObject("hello");
// false
```

---

### 4. Common checks cheat sheet

```javascript
const value = ...;

typeof value === "string"
typeof value === "number"
typeof value === "boolean"
typeof value === "undefined"
typeof value === "function"

Array.isArray(value)

value === null
```

For objects:

```javascript
value !== null &&
typeof value === "object" &&
!Array.isArray(value)
```

### 5. `Number` has a couple of important cases

This:

```javascript
typeof NaN
// "number"
```

And:

```javascript
typeof Infinity
// "number"
```

If you want to check whether something is actually a valid number:

```javascript
Number.isFinite(value)
```

Examples:

```javascript
Number.isFinite(123);
// true

Number.isFinite(NaN);
// false

Number.isFinite(Infinity);
// false

Number.isFinite("123");
// false
```

### Interview-friendly table

| Value              | Check                          | Result |
| ------------------ | ------------------------------ | ------ |
| `"hello"`          | `typeof value === "string"`    | ✅      |
| `123`              | `typeof value === "number"`    | ✅      |
| `true`             | `typeof value === "boolean"`   | ✅      |
| `undefined`        | `typeof value === "undefined"` | ✅      |
| `null`             | `value === null`               | ✅      |
| `[1,2,3]`          | `Array.isArray(value)`         | ✅      |
| `{}`               | `typeof value === "object"`    | ✅      |
| `function(){}`     | `typeof value === "function"`  | ✅      |
| `NaN`              | `Number.isNaN(value)`          | ✅      |
| `123` valid number | `Number.isFinite(value)`       | ✅      |

**The two JavaScript gotchas to remember for interviews:**

```javascript
typeof null === "object"   // true 😬
typeof [] === "object"     // true 😬
```

Therefore, for arrays always prefer **`Array.isArray()`**.
