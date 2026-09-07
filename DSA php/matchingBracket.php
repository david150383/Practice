<?php

function isPared($str) {
    $brackets = [
        "(" => ")",
        "{" => "}",
        "[" => "]"
    ];

    $stack = [];

    for ($i = 0; $i < strlen($str); $i++) {
        $char = $str[$i];

        if (isset($brackets[$char])) {
            // Opening bracket
            $stack[] = $char;

        } else if (in_array($char, array_values($brackets))) {
            // Closing bracket
            if (count($stack) === 0) {
                return false;
            }

            $lastOpen = array_pop($stack);

            if ($brackets[$lastOpen] !== $char) {
                return false;
            }
        }
    }

    return count($stack) === 0;
}

var_dump(isPared("({2+3}*4)")); // true
var_dump(isPared("({2+3}*4]")); // false
var_dump(isPared(")"));         // false
?>