//add number in assending order
//[1, 4, 6, 9]
//when add 2 it should add before 4
//FIFO
function queue2(arr, number) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] > number) {
      arr[i + 1] = arr[i];
    } else {
      break;
    }
  }
  arr[i + 1] = number;
  return arr;
}

console.log(queue2([1, 4, 6, 7], 2));
