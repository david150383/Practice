<?php 
$a = [8,7,0,6,5,0,1,2,3,4];
//echo count($a);

// for($i=0; count($a) > $i; $i++) {
//     //echo $a[$i]. '\n';
// }
// $b = array_push($a, 15);
// echo $b;
// foreach($a as $newA) {
//     echo $newA."\n";
// }
// print_r($a);

//Reverse an Array
$rev = array_reverse($a);
print_r($rev);

//Find Maximum Element
$max = max($a);
echo "\nMax is : ".$max;

//Second Largest Element
$arr = array_unique($a);
rsort($arr);
echo "\nSecond Largest Element is : ".$arr[1];

//Move Zeros to End
$nonZero = array_filter($a);
$result = array_merge($nonZero, array_fill(0, count($a)-count($nonZero), 0));
print_r($result);


//Check Palindrome String
$str = "madam";
echo $str === strrev($str);


//Two Sum
function twoSum($nums, $target) {
    $map = [];
    foreach ($nums as $i => $n) {
        if (isset($map[$target - $n])) return [$map[$target - $n], $i];
        $map[$n] = $i;
    }
}
print_r(twoSum($a, 9));

//Missing Number
function missingNumber($arr, $n) {
    return ($n * ($n+1))/2 - array_sum($arr);
}
echo missingNumber($arr, 15);

class Person {
    public $id;
    function __construct($id) {
        $this->id = $id;
    }

    function printId() {
        echo $this->id;
    }
}

$person = new Person(4);
$person->printId();

class Fruit {
  public $name;
  public $color;

  function __construct($name) {
    $this->name = $name;
  }
  function get_name() {
    return $this->name;
  }
}

$apple = new Fruit("Apple");
echo $apple->get_name();

?>