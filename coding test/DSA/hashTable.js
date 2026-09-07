//in java its hashtable, in javascript we call it object, in c# its dictionary.
//find first non repeated character in string
// example a green apple
//so here answer will be g

function firstNonRepeatedCharOld(str) {
  let object = {};
  for (let i = 0; i < str.length - 1; i++) {
    if (object[str[i]]) object[str[i]] += 1;
    else object[str[i]] = 1;
  }
  for (key in object) {
    if (object[key] === 1) {
      return key;
    }
  }
  return "not found";
}

//chatGPT optimized. Your second loop iterates over the object's keys: order is not guaranteed to match the original string order
function firstNonRepeatedChar(str) {
  const map = Object.create(null);
  for (const ch of str) {
    map[ch] = (map[ch] ?? 0) + 1;
  }
  for (const ch of str) {
    if (map[ch] === 1) {
      return ch;
    }
  }

  return "not found";
}
console.log(firstNonRepeatedChar("a green apple"));
