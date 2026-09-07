/*=============================================================
1️⃣ “How do you add or remove elements from an array ?”
=============================================================*/
//1. push() – add to end
let arr1 = [1, 2];
arr1.push(3);
// [1, 2, 3]

//2. pop() – remove from end and return that
let last = arr1.pop();
//arr1 will be [1, 2]
//last will be 3

//3. unshift() – add to start
arr1.unshift(0);
// [0, 1, 2]

//4. shift() – remove from start
arr1.shift();
// [1, 2]

/*=============================================================
2️⃣ “How do you loop over an array ?”
=============================================================*/
//5. forEach()
[1, 2, 3].forEach((num) => console.log(num));
//Interview tip: forEach does not return a new array.

/*=============================================================
3️⃣ “How do you transform an array ?”
=============================================================*/
//6. map()
let nums1 = [1, 2, 3];

let doubled = nums1.map((n) => n * 2);
// [2, 4, 6]

/*=============================================================
4️⃣ “How do you filter values from an array ?”
=============================================================*/
//7. filter()
let nums2 = [1, 2, 3, 4];

let evens = nums2.filter((n) => n % 2 === 0);
// [2, 4]

/*=============================================================
5️⃣ “How do you find an element ?”
=============================================================*/
//8. find()
let users = [{ id: 1 }, { id: 2 }];

users.find((u) => u.id === 2);
// {id: 2}

//9. findIndex()
users.findIndex((u) => u.id === 2);
// 1

/*=============================================================
6️⃣ “How do you check if something exists in an array ?”
=============================================================*/
//10. includes()
[1, 2, 3].includes(2); // true

//11. some() - condition should be true for at least for one
[1, 3, 5].some((n) => n % 2 === 0); // false

//12. every() - condition should be true for all
[2, 4, 6].every((n) => n % 2 === 0); // true

/*=============================================================
7️⃣ “How do you reduce an array to a single value ?”
=============================================================*/
//13. reduce()(VERY IMPORTANT)
let nums3 = [1, 2, 3, 4];

let sum = nums3.reduce((acc, cur) => acc + cur, 0);
// 10
//💡 Interview tip: reduce can replace map, filter, and loops.

/*=============================================================
8️⃣ “How do you sort arrays ?”
=============================================================*/
//14. sort()
let nums4 = [10, 2, 5];

nums4.sort((a, b) => a - b);
// [2, 5, 10]
//⚠️ Without a compare function, sort is string - based.

/*=============================================================
9️⃣ “How do you combine or copy arrays ?”
=============================================================*/
//15. concat()

[1, 2].concat([3, 4]);
// [1, 2, 3, 4]

//16. Spread operator
let arr5 = [1, 2, 3, 4];
let newArray = [...arr5, 5, 6];
// [ 1, 2, 3, 4, 5, 6 ]
/*=============================================================
🔟 “How do you slice or splice an array ?”
=============================================================*/
//17. slice() – non - mutating
let arr = [1, 2, 3, 4];
let newArray2 = arr.slice(1, 3);
console.log(newArray2); // [2, 3]

//18. splice() – mutating
arr.splice(1, 2);
console.log(arr); //print [ 1, 4 ], so removes [2, 3]

//💡 Interview tip: Say: slice does not modify the original array, splice does.

/*=============================================================
1️⃣1️⃣ “How do you flatten arrays ?”
=============================================================*/
//19. flat()
[1, [2, [3]]].flat(2);
// [1, 2, 3]

/*=============================================================
1️⃣2️⃣ “How do you remove duplicates from an array ?”
=============================================================*/
let nums = [1, 2, 2, 3];
[...new Set(nums)];
// [1, 2, 3]

// Rapid Interview One-Liners

// map, filter, reduce → most important

// sort mutates the array ⚠️

// forEach returns undefined

// Arrays are objects in JavaScript
