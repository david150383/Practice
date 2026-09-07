function CalculateTax(income: number, taxYear: number) {
  if (taxYear > 2021) return (income * 30) / 100;
  return (income * 20) / 100;
}

let tax = CalculateTax(1000, 2020);
console.log(tax);

//Enum
enum Size {
  Small,
  Medium,
  Large,
}
let size: Size = Size.Small;

//Tuple
let user: [number, string] = [1, "mosh"];

type Employee = {
  id: number;
  name: string;
  retire: (date: Date) => void;
};

let employee1: Employee;
let employee2: Employee;

employee1 = {
  id: 1,
  name: "mosh",
  retire: (date: Date) => {
    console.log(date);
  },
};

//Union Type
function kgToLbs(weight: number | string) {
  if (typeof weight === "number") {
    return weight * 2.2;
  }
  return parseInt(weight) * 2.2;
}
kgToLbs(2);
kgToLbs("2");

//Intersaction Types
type Draggable = {
  drag: () => void;
};
type Resize = {
  resize: () => void;
};
type UIWidget = Draggable & Resize;
let textbox: UIWidget = {
  drag: () => {},
  resize: () => {},
};

//Literal Types (exact, specific)
let quantity: 50 = 50;
let height: 5 | 7 = 5;

//we can also set type alias for Literal
type Quantity = 50 | 100;
let newHeight: Quantity = 50;
type Metric = "cm" | "inch";

//nullable types.
function greet(name: string | null) {
  if (name) {
    console.log(name);
  } else {
    console.log("holla");
  }
}

greet(null);

//opitonal chaning
type Customer = {
  birthday: Date;
};
function getCustomer(id: number): Customer | null | undefined {
  return id === 0 ? null : { birthday: new Date() };
}
let customer3 = getCustomer(0);
//console.log(customer3.birthday);
//this will give error so we can use optional property access operator
console.log(customer3?.birthday);

interface IAccount {
  readonly id: string;
  name: string;
  balance: number;
  nickname?: string;
  deposit: (amount: number) => void;
}

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
  deposit(amount: number): void {
    if (amount < 1) {
      throw new Error("Amount can not be less than 1");
    }
  }
  get balance(): number {
    return this._balance;
  }
  set balance(value: number) {
    if (value > 0) this._balance = value;
    new Error("wrong value");
  }
}

let account: IAccount = new Account("1", "mosh", 0);
console.log(account.balance);
account.balance = 50;
console.log(account.balance);

class Ride {
  private static _activeRides: number = 0;
  start() {
    Ride._activeRides++;
  }
  static get activeRides() {
    return Ride._activeRides;
  }
}

let ride1 = new Ride();
ride1.start();

let ride2 = new Ride();
ride1.start();

console.log(Ride.activeRides);

class Person {
  constructor(
    public firstName: string,
    public lastName: string,
  ) {}
  walk() {
    console.log("walking");
  }
  get fullname(): string {
    return this.firstName + " " + this.lastName;
  }
}

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

const student1 = new Student("1", "mohan", "sharma");
student1.walk();

class Teacher extends Person {
  override get fullname(): string {
    return "professor" + super.fullname;
  }
}
let teacher = new Teacher("rohit", "sharma");
console.log(teacher.fullname);

//Polymorphism

printPersonNames([
  new Student("1", "student name", "sharma"),
  new Teacher("rohan", "singh"),
]);

function printPersonNames(people: Person[]) {
  for (let person of people) {
    console.log(person.fullname);
  }
}

abstract class Shape {
  constructor(public color: string) {}
  abstract render(): void;
}

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

//Generic
function identity(value: any) {
  return value;
}

const result = identity("Hello");
result.toUpperCase(); // No type safety

function identitynew<T>(value: T): T {
  return value;
}

identitynew<string>("Hello");
identitynew<number>(42);
