function charH1(str) {
    
    if (str.length < 2) {
        return 0;
    }
    
    if (str.substring(0, 3) === "xhi") {
        return charH1(str.substring(3));
    }
    if (str.substring(0, 2) === "hi") {
      return 1 + charH1(str.substring(2));
    }
    return charH1(str.substring(1));
}

console.log(charH1("ashis3hi34xhisfxhi"));