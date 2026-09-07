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
var_dump(isPalindrome("nitin"))
?>