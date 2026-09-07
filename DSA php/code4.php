<?php

// [-4,-1,0,2,10] should return a sorted order with square like 0,1,4,16 100

function sortedSquares($numbers) {
    $result = [];
    $left = 0;
    $right = count($numbers) - 1;
    $position = $right;
    while($left <= $right) {
        $leftSquare = $numbers[$left] ** 2;
        $rightSquare = $numbers[$right] ** 2;
        if ($leftSquare > $rightSquare) {
            $result[$position] = $leftSquare;
            $left++;
        } else {
            $result[$position] = $rightSquare;
            $right--;
        }
        $position--;
    }
    return $result;

}
print_r(sortedSquares([-4, -1, 0, 2, 10]))
?>