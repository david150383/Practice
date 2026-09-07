<?php
//linked list

class Node {
    public $value;
    public $next;

    function __construct($v) {
        $this->value = $v;
    }
}

class LinkedList {
    public $first;
    public $last;

    
    function addLast($value) {
        $node = new Node($value);
        if ($this->isEmpty()) {
            $this->first = $node;
            $this->last = $node;
        } else {
            $this->last->next = $node;
            $this->last = $node;
        }
    }
    function addFirst($value) {
         $node = new Node($value);
        if ($this->isEmpty()) {
            $this->first = $node;
            $this->last = $node;
        } else {
            $node->next = $this->first;
            $this->first = $node;

        }

    }
    function removeFirst() {
        $this->first = $this->first->next;
    }
    function isEmpty() {
        return $this->first === null;
    }
    function indexOf($item) {
        $index = 0;
        $current= $this->first;
        while($current->value != null) {
            if ($current->value === $item) return $index;
            $current = $current->next;
            $index ++;
        }
        return -1;

    }

    function toArray() {
        $array = [];
        $current= $this->first;
        while($current->value !== null) {
            $array[] = $current->value;
            $current = $current->next;
        }
        return $array;

    }

    function contains($item) {
        return $this->indexOf($item) !== -1;
    }

    function removeLast() {
        if($this->isEmpty())
            throw new Exception("List is empty");
        if($this->first === $this->last) {
            $this->first = null;
            $this->last = null;
            return;
        }
            
        $previous = $this->getPrevious($this->last);
        

        $this->last = $previous;
        $this->last->next = null;
    }

    function getPrevious($item) {
        $current = $this->first;
        while($current !== null) {
            if ($current->next === $item) return $current;
            $current = $current->next;
        }
    }

    function getKthfromtheend($k) {
        $a = $this->first;
        $b = $this->first;
        for ($i = 0; $i < $k -1; $i++) {
            $b=$b->next;
        }
        while($b != $this->last) {
            if($b == null) throw new Exception("A custom error message");
            $a = $a->next;
            $b = $b->next;
        }
        return $a->value;
    }

    function reverse() {
        if ($this->isEmpty()) return;
        $previous = $this->first;
        $current = $this->first->next;
        
        while($current !== null) {
            
            $next = $current->next;
            $current->next = $previous;
            $previous = $current;
            $current = $next;
        }

        $this->last = $this->first;
        $this->last->next = null;
        $this->first = $previous;
    }

}

$list = new LinkedList();
$list->addLast(10);
$list->addLast(20);
$list->addLast(30);
$list->addFirst(5);
//echo $list->contains(10);
//print_r($list);
echo $list->getKthfromtheend(2);
//print_r($list->toArray());
//print_r($list);
?>