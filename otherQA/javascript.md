### 1. let vs var in loop
```
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        alert(i);
    }, 3000);
}
```
after 3 second it will show 3 popup one by one with value 0, 1, 2

if we change let i to var i then it will show 3 in all popup because of var 


### 2. javascript array methods mutating vs non mutating

In JavaScript, array methods are categorized as `mutating` (modifying the original array in place) or `non - mutating`(returning a new array while leaving the original untouched).Non - mutating methods are generally preferred for predictable code and are essential for state management in frameworks like React.


##### Mutating Array Methods
These methods directly change the content or structure of the array they are called on. Common examples include: 
**Adding/Removing:** `push()`, `pop()`, `shift()`, `unshift()`, `splice()`
**Ordering/Structuring:** `sort()`, `reverse()`, `fill()`, `copyWithin()`


##### Non-Mutating Array Methods
These methods return a new array, leaving the original data intact. Key examples include: 
**Transformation/Extraction:** `concat()`, `slice()`, `filter()`, `map()`, `reduce()`, `flat()`
**ES2023 Non-mutating Alternatives:** `toSorted()`, `toReversed()`, `toSpliced()`, and `with()`

### 3. Currying
Currying means converting a function that takes multiple arguments into a chain of functions that each take one argument.
nstead of:
```
add(2, 3);
```
you write:
```
add(2)(3);
```
The first function remembers the first value, and the second function uses it.


**Step 1: Normal function**
```
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
```
Both values are given at once.

**Step 2: Curried version**
```
function add(a) {
  return function (b) {
    return a + b;
  };
}

console.log(add(2)(3)); // 5
```

### 4. Optional chaining (?.)

Optional chaining (`?.`) is a JavaScript feature that lets you safely access nested properties or call methods without getting `Cannot read properties of undefined` errors.

Instead of writing multiple checks, you can use `?.`.

#### Before vs After

##### Without optional chaining

JavaScript

```
const user = {};

console.log(user.address.city);
```

Error:

```
TypeError: Cannot read properties of undefined (reading 'city')
```

Because `user.address` doesn't exist.

##### With optional chaining

JavaScript

```
const user = {};

console.log(user.address?.city);
```

Output:

```
undefined
```

Instead of throwing an error, JavaScript returns `undefined`.

#### How it works

JavaScript

```
obj?.property
```

It means:

> "If `obj` exists, access `property`; otherwise return `undefined`."

Equivalent to:

JavaScript

```
obj == null ? undefined : obj.property;
```

(`null` and `undefined` are both checked.)

#### Common use cases

##### 1. Nested objects

JavaScript

```
const user = {
  name: "John",
  address: {
    city: "Hyderabad"
  }
};

console.log(user.address?.city);      // Hyderabad
console.log(user.company?.name);      // undefined
```

##### 2. Arrays

JavaScript

```
const users = [
  { name: "Alice" }
];

console.log(users[0]?.name); // Alice
console.log(users[5]?.name); // undefined
```

##### 3. Function calls

Useful when a callback may or may not exist.

JavaScript

```
function greet(name, callback) {
  console.log(`Hello ${name}`);
  callback?.();
}

greet("Sohin");
greet("Sohin", () => console.log("Callback called"));
```

Output:

```
Hello Sohin
Hello Sohin
Callback called
```

##### 4. API responses (very common)

Suppose an API returns:

JavaScript

```
const response = {
  data: {
    user: {
      profile: {
        email: "test@example.com"
      }
    }
  }
};

console.log(response.data?.user?.profile?.email);
```

If any level is missing, it returns `undefined` instead of crashing.

#### Optional chaining with nullish coalescing

Often used together with `??` to provide a default value.

JavaScript

```
const user = {};

const city = user.address?.city ?? "Unknown";

console.log(city); // Unknown
```

Difference:

|Operator|Meaning|
| --- | --- |
|`?.`|Safely access a property or call a method.|
|`??`|Use a default only when the value is `null` or `undefined`.|

#### Things to remember

##### Doesn't work on an undeclared variable

JavaScript

```
console.log(person?.name);
```

If `person` was never declared, you'll get:

```
ReferenceError: person is not defined
```

##### Cannot assign through optional chaining

JavaScript

```
user?.name = "John";
```

This is invalid.

Instead:

JavaScript

```
if (user) {
  user.name = "John";
}
```

#### Quick cheat sheet

|Syntax|Example|Result|
| --- | --- | --- |
|Property|`user?.name`|Safe property access|
|Nested|`user?.address?.city`|Safe nested access|
|Array|`users?.[0]`|Safe array access|
|Method|`user.sayHi?.()`|Safe function call|
|With default|`user?.name ?? "Guest"`|Default value if missing|

##### Real-world Express example

Since you're working with Express, imagine a POST request:

JavaScript

```
app.post("/users", (req, res) => {
  const city = req.body?.address?.city ?? "Unknown";

  res.json({ city });
});
```

If the client sends:

JSON

```
{
  "address": {
    "city": "Hyderabad"
  }
}
```

Response:

JSON

```
{ "city": "Hyderabad" }
```

If `address` or `city` is missing, the response becomes:

JSON

```
{ "city": "Unknown" }
```

without throwing an error.
