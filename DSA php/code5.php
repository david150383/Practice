<?php
$a1 = [2, 4, 5, 8];
$a2 = [1, 3, 7, 9];
$i = 0;
$j = 0;
$result = [];

while($i<count($a1) && $j<count($a2)) {
  if ($a1[$i] <= $a2[$j]) {
    $result[] = $a1[$i];
    $i++;
  } else {
    $result[] = $a2[$j];
    $j++;
  }
}

while($i<count($a1)) {
    $result[] = $a1[$i];
    $i++;
}

while($j<count($a2)) {
    $result[] = $a2[$j];
    $j++;
}
print_r($result);
//Time: O(n + m)
//Space: O(n + m) for the output array
?>