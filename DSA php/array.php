<?php
$a = [2,4,6,1,3,2,9];

function sortArray($arr) {
    
    for($i = 0; $i < count($arr); $i++ ) {
        for($j = 0; $j < count($arr); $j++ ) {
            if($arr[$i] < $arr[$j]) {
                $backup = $arr[$i];
                $arr[$i] = $arr[$j];
                $arr[$j] = $backup;
            }

        //echo $arr[$i];
        }
    }
    print_r($arr);
}
sortArray($a);


?>