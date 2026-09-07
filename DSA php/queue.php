<?php
//add number in assending order
//[1, 4, 6, 9]
//when add 2 it should add before 4
//FIFO

function Queue($arr, $number) {
    $shifted = false;
    for($i = count($arr)-1; $i>=0; $i--) {
        if ($arr[$i] <= $number && !$shifted) {
            $arr[$i+1] = $number;
            $arr[$i] = $arr[$i];
            $shifted = true;
        } elseif (!$shifted) {
            $arr[$i+1] = $arr[$i]; 
        } 
    }
    print_r($arr);

}

function Queue2($arr, $number) {
    for($i = count($arr)-1; $i>=0; $i--) {
        if ($arr[$i] > $number) {
            $arr[$i + 1] = $arr[$i];
        } else {
            break;
        }
        
    }
    $arr[$i+1] = $number;
    print_r($arr);

}

Queue2([1,4,6,7], 5);

?>