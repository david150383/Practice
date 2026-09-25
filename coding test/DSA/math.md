Sure! Here are some common **JavaScript `Math` functions** with examples and their outputs.

 ## JavaScript Math Functions

 | Function | Example | Output |
| --- | --- | --- |
| `Math.round()` | `Math.round(4.6)` | `5` |
| `Math.floor()` | `Math.floor(4.9)` | `4` |
| `Math.ceil()` | `Math.ceil(4.1)` | `5` |
| `Math.trunc()` | `Math.trunc(4.9)` | `4` |
| `Math.abs()` | `Math.abs(-10)` | `10` |
| `Math.pow()` | `Math.pow(2, 3)` | `8` |
| `Math.sqrt()` | `Math.sqrt(25)` | `5` |
| `Math.max()` | `Math.max(10, 20, 5)` | `20` |
| `Math.min()` | `Math.min(10, 20, 5)` | `5` |
| `Math.random()` | `Math.random()` | Random number between `0` and `1` |
| `Math.sign()` | `Math.sign(-25)` | `-1` |

### 1\. `Math.round()`

 Rounds a number to the nearest integer.

```
console.log(Math.round(4.4));
console.log(Math.round(4.6));
```

 **Output:**

```
4
5
```

 ### 2\. `Math.floor()`

 Rounds **down** to the nearest integer.

```
console.log(Math.floor(4.9));
console.log(Math.floor(4.1));
```

 **Output:**

```
4
4
```

 ### 3\. `Math.ceil()`

 Rounds **up** to the nearest integer.

```
console.log(Math.ceil(4.1));
console.log(Math.ceil(4.9));
```

 **Output:**

```
5
5
```

 ### 4\. `Math.trunc()`

 Removes the decimal part without rounding.

```
console.log(Math.trunc(7.89));
console.log(Math.trunc(-7.89));
```

 **Output:**

```
7
-7
```

 ### 5\. `Math.abs()`

 Returns the positive/absolute value.

```
console.log(Math.abs(-25));
console.log(Math.abs(25));
```

 **Output:**

```
25
25
```

 ### 6\. `Math.pow()`

 Returns a number raised to a power.

```
console.log(Math.pow(2, 3));
console.log(Math.pow(5, 2));
```

 **Output:**

```
8
25
```

 You can also use the `**` operator:

```
console.log(2 ** 3);
```

 **Output:**

```
8
```

 ### 7. `Math.sqrt()`

 Finds the square root.

```
console.log(Math.sqrt(16));
console.log(Math.sqrt(81));
```

 **Output:**

```
4
9
```

 ### 8\. `Math.max()`

 Returns the largest number.

```
console.log(Math.max(10, 50, 20, 5));
```

 **Output:**

```
50
```

 ### 9\. `Math.min()`

 Returns the smallest number.

```
console.log(Math.min(10, 50, 20, 5));
```

 **Output:**

```
5
```

 ### 10\. `Math.random()`

 Generates a random decimal number from **0 (inclusive) to 1 (exclusive)**.

```
console.log(Math.random());
```

 **Example output:**

```
0.736421
```

 The output will be different each time.

 For a random number from **1 to 10**:

```
console.log(Math.floor(Math.random() * 10) + 1);
```

 **Example output:**

```
7
```

 ### 11\. `Math.sign()`

 Tells whether a number is positive, negative, or zero.

```
console.log(Math.sign(25));
console.log(Math.sign(-25));
console.log(Math.sign(0));
```

 **Output:**

```
1
-1
0
```

 ### A few more useful functions

```
console.log(Math.PI);          // 3.141592653589793
console.log(Math.E);           // 2.718281828459045

console.log(Math.sin(0));      // 0
console.log(Math.cos(0));      // 1
console.log(Math.tan(0));      // 0

console.log(Math.log(1));      // 0
console.log(Math.log10(100));  // 2
```

 **Quick way to remember:**

 - `round()` → nearest
- `floor()` → down
- `ceil()` → up
- `trunc()` → remove decimal
- `abs()` → positive value
- `sqrt()` → square root
- `pow()` → power
- `max()` → biggest
- `min()` → smallest
- `random()` → random number

 If you're learning JavaScript, these are among the most useful `Math` methods to practice first.