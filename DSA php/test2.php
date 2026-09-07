<?php
/*


https://www.programiz.com/online-compiler/4jCexemcFv5QD


# Unique Elements
Given an indexed array. Remove duplicates from the array and return the new array.
Note that you need to maintain the same order of elements while returning the new array.
Example 1:
Input: [10, 10, 25, 30, 14, 30, 10]
Expected Output: [25,14]
Explanation: Only 25 and 14 are the unique elements. Rest all have duplicates. So, only return these 2 numbers.

Example 2:
Input: [25, 25, 25]
Expected Output: []
Explanation: No elements are unique. So, return an empty array.
Example 3:

Input: [1, 2, 3, 4, 5] 
Expected Output: [1, 2, 3, 4, 5]
Explanation: All elements are unique. So, return all of them.
*/

class UniqueCheck
{
    public function getSingleOccurrenceValues(array $a): array
    {
        $newA = [];
        foreach($a as $k) {
            $newA[$k] +=1; 
        }
        $newB = [];
        foreach($newA as $i => $j) {
            if ($j < 2) {
                $newB[] = $i;
            }
        }
        return $newB;
    }
}


echo implode(',', (new UniqueCheck())->getUniqueElements([1, 2, 3, 4, 5]));
?>