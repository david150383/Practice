<?php
//LiFO = Last in first out;
//Methods push, pop, peek = show last one, isEmpty


function reverseString($str) {
    //echo strlen($str[0]);
    $reverse = '';
    for($i=strlen($str)-1;$i >= 0; $i--) {
        $reverse.=$str[$i]; 
    }
    return $reverse;

}
//echo reverseString('rashid');

/* Balance stack questions */
//note instead of boolean i have used string true false, because in case of false output will show nothing.
function isBalanced($str) {
    $stack = [];
    for($i=0;$i <= strlen($str)-1; $i++) {
        if ($str[$i] === "(")
            $stack[] = $str[$i];
        if ($str[$i] === ")") {
            if (count($stack) === 0)
                return 'FALSE';
            array_pop($stack);
        }
    }
    return (count($stack) === 0) ? 'TRUE' : 'FALSE';
}

//echo isBalanced("(( 1 + 2)"); //Output : FALSE
//echo isBalanced(") 1 + 2 ("); //Output : FALSE
//echo isBalanced("( 1 + 2)"); //Output : TRUE

//Multiple tags
class Balance {
    public function isBalancedAll($str) {
        $stack = [];
        for($i=0;$i <= strlen($str)-1; $i++) {
            if ($this->isOpeningBracket($str[$i]))
                $stack[] = $str[$i];
            if ($this->isClosingBracket($str[$i])) {
                if (count($stack) === 0)
                    return 'FALSE';
                $open = array_pop($stack);
                if (!$this->isBracketMatch($open, $str[$i]))
                    return 'FALSE';
            }
        }
        return (count($stack) === 0) ? 'TRUE' : 'FALSE';
    }
    private function isOpeningBracket($ch) {
        return ($ch === '(' || $ch === '{' || $ch === '[' || $ch === '<');
    }

    private function isClosingBracket($ch) {
        return ($ch === ')' || $ch === '}' || $ch === ']' || $ch === '>');
    }

    private function isBracketMatch($opening, $closing) {
        return (
            ($opening === '(' && $closing === ')') ||  
            ($opening === '{' && $closing === '}') ||  
            ($opening === '[' && $closing === ']') ||  
            ($opening === '<' && $closing === '>'));
    }
}
//$b = new Balance();
//echo $b->isBalancedAll('({[< 4 + 5 >]})');

//Multiple tags
class Balance2 {
    private $tagsArray = ["(" => ")", "{" => "}", "[" => "]", "<" => ">"];
    public function isBalancedAll($str) {
        $stack = [];
        for($i=0;$i <= strlen($str)-1; $i++) {
            if ($this->isOpeningBracket($str[$i]))
                $stack[] = $str[$i];
            if ($this->isClosingBracket($str[$i])) {
                if (count($stack) === 0)
                    return 'FALSE';
                $open = array_pop($stack);
                if (!$this->isBracketMatch($open, $str[$i]))
                    return 'FALSE';
            }
        }
        return (count($stack) === 0) ? 'TRUE' : 'FALSE';
    }
    private function isOpeningBracket($ch) {
        return ($ch === '(' || $ch === '{' || $ch === '[' || $ch === '<');
    }

    private function isClosingBracket($ch) {
        return ($ch === ')' || $ch === '}' || $ch === ']' || $ch === '>');
    }

    private function isBracketMatch($opening, $closing) {
        return $this->tagsArray[$opening] === $closing;
    }
}
$b = new Balance2();
echo $b->isBalancedAll('({[< 4 + 5 >]})');

?>