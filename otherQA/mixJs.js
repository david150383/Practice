const array = [
  { date: "2022-02-10T13:10:00.000Z", value: 10 },
  { date: "2022-02-10T13:15:00.000Z", value: 20 },
];
const string = JSON.stringify(array);
console.log(string);

const arrayBack = JSON.parse(string);
console.log(arrayBack);

const date = new Date(); //
date.setUTCDate(date.getUTCDate() + 1); //add one day
console.log(date.toISOString());

const map = Object.create(null); //SAME TO map = {}; but more optimized because no prototype so you will get whatever you added
map["name"] = "mohan";
map["age"] = 43;
const keys = Object.keys(map);
const values = Object.values(map);
console.log(keys);
console.log(values);

const obj = {
  prop: 42,
};

Object.freeze(obj);
obj.prop = 32; //now object is read only so we can not change it
console.log(obj.prop);

//apply vs bind
/*
Feature	      apply()	                    bind()
Execution	    Immediate	                  Delayed (returns function)
Arguments	    Array	                      Individually (or partial)
Return value	Function result             New bound function
Use case	    Quick call with array	      Reusable function with fixed this

Simple analogy
apply() → “Run this function now with this this and these arguments.”
bind() → “Give me a new function that will always use this this.”


function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}
const person = { name: "Amit" };

Example apply
greet.apply(person, ["Hello", "!"]);
// Output: Hello, Amit!


Example bind
const person = { name: "Amit" };
const boundGreet = greet.bind(person, "Hello");
boundGreet("!");
// Output: Hello, Amit!
*/
