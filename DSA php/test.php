<?php
$a1 = [2, 4, 5, 8];
$a2 = [1, 3, 7, 9];

$result = [];
$i = 0;
$j = 0;

while($i < count($a1) && $j < count($a2)) {
  if($a1[$i] < $a2[$j]) {
    $result[] = $a1[$i];
    $i++;
  } else {
    $result[] = $a2[$j];
    $j++;
  }
}

print_r($result);
?>