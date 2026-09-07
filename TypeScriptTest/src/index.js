var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function CalculateTax(income, taxYear) {
    if (taxYear > 2021)
        return (income * 30) / 100;
    return (income * 20) / 100;
}
var tax = CalculateTax(1000, 2020);
console.log(tax);
//Enum
var Size;
(function (Size) {
    Size[Size["Small"] = 0] = "Small";
    Size[Size["Medium"] = 1] = "Medium";
    Size[Size["Large"] = 2] = "Large";
})(Size || (Size = {}));
var size = Size.Small;
//Tuple
var user = [1, "mosh"];
var employee1;
var employee2;
employee1 = {
    id: 1,
    name: "mosh",
    retire: function (date) {
        console.log(date);
    },
};
//Union Type
function kgToLbs(weight) {
    if (typeof weight === "number") {
        return weight * 2.2;
    }
    return parseInt(weight) * 2.2;
}
kgToLbs(2);
kgToLbs("2");
var textbox = {
    drag: function () { },
    resize: function () { },
};
//Literal Types (exact, specific)
var quantity = 50;
var height = 5;
var newHeight = 50;
//nullable types.
function greet(name) {
    if (name) {
        console.log(name);
    }
    else {
        console.log("holla");
    }
}
greet(null);
function getCustomer(id) {
    return id === 0 ? null : { birthday: new Date() };
}
var customer3 = getCustomer(0);
//console.log(customer3.birthday);
//this will give error so we can use optional property access operator
console.log(customer3 === null || customer3 === void 0 ? void 0 : customer3.birthday);
var Account = /** @class */ (function () {
    function Account(id, name, balance) {
        this.id = id;
        this.name = name;
        this._balance = balance;
    }
    Account.prototype.deposit = function (amount) {
        if (amount < 1) {
            throw new Error("Amount can not be less than 1");
        }
    };
    Object.defineProperty(Account.prototype, "balance", {
        get: function () {
            return this._balance;
        },
        set: function (value) {
            if (value > 0)
                this._balance = value;
            new Error("wrong value");
        },
        enumerable: false,
        configurable: true
    });
    return Account;
}());
var account = new Account("1", "mosh", 0);
console.log(account.balance);
account.balance = 50;
console.log(account.balance);
var Ride = /** @class */ (function () {
    function Ride() {
    }
    Ride.prototype.start = function () {
        Ride._activeRides++;
    };
    Object.defineProperty(Ride, "activeRides", {
        get: function () {
            return Ride._activeRides;
        },
        enumerable: false,
        configurable: true
    });
    Ride._activeRides = 0;
    return Ride;
}());
var ride1 = new Ride();
ride1.start();
var ride2 = new Ride();
ride2.start();
console.log(Ride.activeRides);
var Person = /** @class */ (function () {
    function Person(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    Person.prototype.walk = function () {
        console.log("walking");
    };
    Object.defineProperty(Person.prototype, "fullname", {
        get: function () {
            return this.firstName + " " + this.lastName;
        },
        enumerable: false,
        configurable: true
    });
    return Person;
}());
var Student = /** @class */ (function (_super) {
    __extends(Student, _super);
    function Student(studentId, firstName, lastName) {
        var _this = _super.call(this, firstName, lastName) || this;
        _this.studentId = studentId;
        return _this;
    }
    Student.prototype.takeTest = function () {
        console.log("taking test");
    };
    return Student;
}(Person));
var student1 = new Student("1", "mohan", "sharma");
student1.walk();
// class Teacher extends Person {
//   override get fullname(): string {
//     return "professor" + super.fullname;
//   }
// }
// let teacher = new Teacher("rohit", "sharma");
// console.log(teacher.fullname);
//Polymorphism
printPersonNames([
    new Student("1", "student name", "sharma"),
    //new Teacher("rohan", "singh"),
]);
function printPersonNames(people) {
    for (var _i = 0, people_1 = people; _i < people_1.length; _i++) {
        var person = people_1[_i];
        console.log(person.fullname);
    }
}
var Shape = /** @class */ (function () {
    function Shape(color) {
        this.color = color;
    }
    return Shape;
}());
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(radius, color) {
        var _this = _super.call(this, color) || this;
        _this.radius = radius;
        return _this;
    }
    Circle.prototype.render = function () {
        console.log("render");
    };
    return Circle;
}(Shape));
//Generic
function identity(value) {
    return value;
}
var result = identity("Hello");
result.toUpperCase(); // No type safety
function identitynew(value) {
    return value;
}
identitynew("Hello");
identitynew(42);
