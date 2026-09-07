class Node {
  constructor(value) {
    this.value = value; // The value/key of the node
    this.leftChild = null; // Reference to the leftChild child node
    this.rightChild = null; // Reference to the rightChild child node
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null; // The root node of the tree, initially null
  }

  // Helper method to insert a new node
  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  // Helper function to insert a node in the tree
  insertNode(current, newNode) {
    while (true) {
      if (newNode.value < current.value) {
        if (current.leftChild === null) {
          current.leftChild = newNode;
          break;
        }
        current = current.leftChild;
      } else {
        if (current.rightChild === null) {
          current.rightChild = newNode;
          break;
        }
        current = current.rightChild;
      }
    }
  }

  find(value) {
    let current = this.root;
    while (current !== null) {
      if (value < current.value) {
        current = current.leftChild;
      } else if (value > current.value) {
        current = current.rightChild;
      } else {
        return true;
      }
    }
    return false;
  }

  // Example helper method: In-order traversal (LeftChild, Root, RightChild)
  inorder(node) {
    if (node !== null) {
      this.inorder(node.leftChild);
      console.log(node.value);
      this.inorder(node.rightChild);
    }
  }

  // Helper function to get the root node of the tree
  getRootNode() {
    return this.root;
  }

  equals(first, second) {
    if (first == null && second == null) {
      return true;
    }
    if (first != null && second != null) {
      return (
        first.value === second.value &&
        this.equals(first.leftChild, second.leftChild) &&
        this.equals(first.rightChild, second.rightChild)
      );
    }
    return false;
  }
}

// Create a new BinarySearchTree instance
const bst = new BinarySearchTree();

// Insert value into the tree
bst.insert(25);
bst.insert(20);
bst.insert(36);
bst.insert(10);
bst.insert(22);
bst.insert(30);
bst.insert(40);

// Create a new BinarySearchTree instance
const bst2 = new BinarySearchTree();

// Insert value into the tree
bst2.insert(25);
bst2.insert(20);
bst2.insert(36);
bst2.insert(10);
bst2.insert(22);
bst2.insert(30);
bst2.insert(40);

// Perform in-order traversal to see the sorted elements
console.log("In-order traversal:");
const root = bst.getRootNode();
bst.inorder(root);
console.log(bst.find(40));
// Output will be: 10, 20, 22, 25, 30, 36, 40 (sorted order)
//console.log(bst.equals(bst.getRootNode(), bst2.getRootNode()));
