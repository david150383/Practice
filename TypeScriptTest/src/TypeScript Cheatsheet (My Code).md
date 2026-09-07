# TypeScript Cheatsheet (Based on Your Code)

This cheatsheet is customized using your examples, so it should feel much easier to remember.

---

# Functions

```ts id="n6xj1e"
function CalculateTax(income: number, taxYear: number) {
  if (taxYear > 2021) return (income * 30) / 100;
  return (income * 20) / 100;
}

let tax = CalculateTax(1000, 2020);
console.log(tax);
```

### Key Points

- `income: number` → parameter type
- `taxYear: number` → parameter type
- TypeScript infers return type automatically

---

# Enums

Used for predefined constants.

```ts id="s4m7yb"
enum Size {
  Small,
  Medium,
  Large,
}

let size: Size = Size.Small;
```

### Enum Values

```ts id="znmnvp"
Small = 0;
Medium = 1;
Large = 2;
```

---

# Tuples

Fixed-length arrays with specific types.

```ts id="b2v8tn"
let user: [number, string] = [1, "mosh"];
```

### Structure

```ts id="ag2z2k"
[id, name];
```

---

# Type Aliases

Create reusable custom types.

```ts id="m4fd5f"
type Employee = {
  id: number;
  name: string;
  retire: (date: Date) => void;
};
```

### Usage

```ts id="5dquww"
let employee1: Employee;

employee1 = {
  id: 1,
  name: "mosh",
  retire: (date: Date) => {
    console.log(date);
  },
};
```

---

# Union Types

Variable can hold multiple types.

```ts id="swy7v9"
function kgToLbs(weight: number | string) {
  if (typeof weight === "number") {
    return weight * 2.2;
  }

  return parseInt(weight) * 2.2;
}
```

### Usage

```ts id="cbmukj"
kgToLbs(2);
kgToLbs("2");
```

### Type Narrowing

```ts id="xzwrfx"
typeof weight === "number";
```

Narrows the type inside the condition.

---

# Intersection Types

Combine multiple types into one.

```ts id="7i8sl5"
type Draggable = {
  drag: () => void;
};

type Resize = {
  resize: () => void;
};

type UIWidget = Draggable & Resize;
```

### Usage

```ts id="4xgkrj"
let textbox: UIWidget = {
  drag: () => {},
  resize: () => {},
};
```

---

# Literal Types

Exact values only.

```ts id="7utfln"
let quantity: 50 = 50;
```

### Multiple Literal Values

```ts id="1mj8x6"
let height: 5 | 7 = 5;
```

### Type Alias with Literals

```ts id="d45qje"
type Quantity = 50 | 100;

let newHeight: Quantity = 50;
```

---

# String Literal Types

```ts id="4zjvvf"
type Metric = "cm" | "inch";
```

Useful for:

- APIs
- Dropdown values
- Config options

---

# Nullable Types

```ts id="7nkm2n"
function greet(name: string | null) {
  if (name) {
    console.log(name);
  } else {
    console.log("holla");
  }
}

greet(null);
```

---

# Optional Chaining

Prevents null/undefined errors.

```ts id="d9b35f"
type Customer = {
  birthday: Date;
};

function getCustomer(id: number): Customer | null | undefined {
  return id === 0 ? null : { birthday: new Date() };
}

let customer3 = getCustomer(0);

console.log(customer3?.birthday);
```

### Without Optional Chaining

```ts id="8x6mcm"
customer3.birthday; // ❌ Error
```

---

# Interfaces

Define contracts for objects/classes.

```ts id="gj3bzd"
interface IAccount {
  readonly id: string;
  name: string;
  balance: number;
  nickname?: string;
  deposit: (amount: number) => void;
}
```

### Features Used

| Feature      | Meaning             |
| ------------ | ------------------- |
| `readonly`   | Cannot modify       |
| `?`          | Optional property   |
| method types | Function signatures |

---

# Classes

```ts id="k7pj39"
class Account implements IAccount {
  name: string;
  private _balance: number;
  nickname?: string;

  constructor(
    public readonly id: string,
    name: string,
    balance: number,
  ) {
    this.name = name;
    this._balance = balance;
  }
}
```

---

# Access Modifiers

| Modifier   | Meaning               |
| ---------- | --------------------- |
| `public`   | Accessible everywhere |
| `private`  | Only inside class     |
| `readonly` | Cannot change         |

---

# Getters & Setters

```ts id="9hl2v8"
get balance(): number {
  return this._balance;
}

set balance(value: number) {
  if (value > 0) this._balance = value;
}
```

### Usage

```ts id="rq5zpv"
account.balance = 50;
console.log(account.balance);
```

Looks like a property but behaves like methods.

---

# Static Members

Belong to the class itself, not objects.

```ts id="gcvl6r"
class Ride {
  private static _activeRides: number = 0;

  start() {
    Ride._activeRides++;
  }

  static get activeRides() {
    return Ride._activeRides;
  }
}
```

### Usage

```ts id="hqy6k6"
console.log(Ride.activeRides);
```

---

# Inheritance

```ts id="4u9q2l"
class Person {
  constructor(
    public firstName: string,
    public lastName: string,
  ) {}

  walk() {
    console.log("walking");
  }
}
```

### Child Class

```ts id="t6b30k"
class Student extends Person {
  constructor(
    public studentId: string,
    firstName: string,
    lastName: string,
  ) {
    super(firstName, lastName);
  }

  takeTest() {
    console.log("taking test");
  }
}
```

---

# `super`

Calls parent constructor.

```ts id="l7x6h1"
super(firstName, lastName);
```

---

# Method Overriding

```ts id="h8jvww"
class Teacher extends Person {
  override get fullname(): string {
    return "professor " + super.fullname;
  }
}
```

### `override`

Ensures method exists in parent class.

---

# Polymorphism

Same method behaves differently.

```ts id="7m2l8l"
function printPersonNames(people: Person[]) {
  for (let person of people) {
    console.log(person.fullname);
  }
}
```

### Usage

```ts id="v7l4xr"
printPersonNames([
  new Student("1", "student name", "sharma"),
  new Teacher("rohan", "singh"),
]);
```

---

# Abstract Classes

Cannot create objects directly.

```ts id="j7j5hj"
abstract class Shape {
  constructor(public color: string) {}

  abstract render(): void;
}
```

### Implementation

```ts id="zk8n8j"
class Circle extends Shape {
  constructor(
    public radius: number,
    color: string,
  ) {
    super(color);
  }

  override render() {
    console.log("render");
  }
}
```

---

# Generics

Reusable types with type safety.

---

## Without Generics

```ts id="7k8ehx"
function identity(value: any) {
  return value;
}

const result = identity("Hello");

result.toUpperCase();
```

### Problem

`any` removes type safety.

---

## With Generics

```ts id="89m6mj"
function identitynew<T>(value: T): T {
  return value;
}
```

### Usage

```ts id="7p2m0n"
identitynew<string>("Hello");
identitynew<number>(42);
```

### Benefits

- Reusable
- Type-safe
- Better autocomplete

---

# Important Operators Used

| Operator | Meaning                      |            |
| -------- | ---------------------------- | ---------- |
| `        | `                            | Union type |
| `&`      | Intersection type            |            |
| `?`      | Optional / Optional chaining |            |
| `:`      | Type annotation              |            |
| `<>`     | Generic types                |            |

---

# OOP Concepts Covered in Your Code

| Concept       | Example                  |
| ------------- | ------------------------ |
| Encapsulation | `private _balance`       |
| Inheritance   | `Student extends Person` |
| Polymorphism  | `printPersonNames()`     |
| Abstraction   | `abstract class Shape`   |
| Interfaces    | `IAccount`               |

---

# Most Important Interview Topics From Your Code

1. Union Types
2. Type Narrowing
3. Interfaces vs Types
4. Access Modifiers
5. Getters/Setters
6. Inheritance
7. Polymorphism
8. Abstract Classes
9. Generics
10. Optional Chaining
