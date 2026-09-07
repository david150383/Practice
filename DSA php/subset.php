<?php
function subset($array) {
    $subset = [];
    for($i=0; $i<count($array); $i++) {
        for($j=0; $j<=$i; $j++) {
            $subset[$i][] = $array[$j];
            echo "*";
        }
        echo "\n";
    }

    $totalLength = count($array);
    for($k=$totalLength-2; $k>=0; $k--) {
        $index = 0;
        for($j=$k; $j>=0; $j--) {
            $subset[$totalLength+$index][] = $array[$j];
            echo "*";
        }
        $index++;
        echo "\n";
    }
    print_r($subset);
} 
//subset([1,2,3,4,5,6]);


//Get all possible subsets (power set)
function powerSet($array) {
    $results = [[]];
    foreach ($array as $value) {
        foreach ($results as $subset) {
            $results[] = array_merge($subset, [$value]);
        }
    }
    return $results;
}

print_r(powerSet([1, 2, 3]));

//Get all possible subsets (power set) without array merge
function powerSet2($array) {
    $results = [[]];
    foreach ($array as $value) {
        foreach ($results as $subset) {
            $mergeSubset = [];
            foreach($subset as $svalue) {
                $mergeSubset[] = $svalue;
            }
            $mergeSubset[] = $value;
            $results[] = $mergeSubset;
            //$results[] = array_merge($subset, [$value]);
        }
    }
    return $results;
}

print_r(powerSet2([1, 2, 3]));




echo "\n\n";

//
?>