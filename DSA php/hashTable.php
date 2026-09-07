<?php
//in java its hashtable, in javascript we call it object, in c# its dictionary.
//find first non repeated character in string 
// example a green Apple
//so here answer will be g

function firstNonRepeatedChar($str) {
    $nonRepeated = [];
    for($i=0; $i< strlen($str); $i++) {
        $nonRepeated[$str[$i]][] = 1;
    }

    for($i=0; $i< strlen($str); $i++) {
        if (count($nonRepeated[$str[$i]]) === 1) 
        {
            return $str[$i];
        }
    }
    return 'Not Found';
}

echo firstNonRepeatedChar('a green apple');
?>
