let array = [2, 3, 4, 5, 6, 2, 3, 4, 5];
let array2 = new Set(array); // set can not hold duplicate, so automatic removed.
let array3 = Array.from(array2); //convert set into array
let array4 = [...array2]; //convert set into array

console.log(array3);
console.log(array4);

//above two line code in one line
let outputArray = Array.from(new Set(array));

console.log(outputArray);
