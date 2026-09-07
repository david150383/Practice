<?php
function isPalindrome($str) {
    $length = strlen($str);
    $half = $length / 2;
    for($i=0; $i<$half; $i++) {
        if ($str[$i] !== $str[$length - $i -1]) {
            return false;
        }
    }
    return true;
}
function longestPalindrome($s) {
    $max = "";
    $n = strlen($s);
    for($i=0; $i<$n; $i++) {
        for($j=$i+1; $j<=$n; $j++) {
            $substr = substr($s, $i, $j-$i);
            if (isPalindrome($substr) && strlen($max) < strlen($substr)) {
                $max = $substr;
            }
        }
    }
    return $max;

}
var_dump(longestPalindrome("a21322bcba"))
?>