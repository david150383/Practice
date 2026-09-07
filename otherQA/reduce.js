const array = [
  { date: "2022-02-10T13:10:00.000Z", value: 10 },
  { date: "2022-02-10T13:15:00.000Z", value: 20 },
];
const total = array.reduce((acc, cur) => {
  return (acc += cur.value);
}, 0);
console.log(total);

//return same array just see how we can iterate and return
const sameArray = array.reduce((acc, cur) => {
  acc.push(cur);
  return acc;
}, []);
console.log(sameArray);

//return same array just update value multiply by 5
const multiplyby5 = array.reduce((acc, cur) => {
  cur.value = cur.value * 5;
  acc.push(cur);
  return acc;
}, []);
console.log(multiplyby5);
