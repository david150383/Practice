function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// Usage
const log = debounce(() => console.log("Called!"), 500);

//throttle
function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// Usage
const log2 = throttle(() => console.log("Called!"), 500);

// How it behaves (quick intuition)

// Debounce → “Wait until things stop happening”

// Throttle → “Run at most once every delay ms”

// So if you’re:

// handling scroll / resize → throttle ✅

// handling search input / typing → debounce
