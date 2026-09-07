const fs = require("fs");

//Read a file asynchronously (most common)
fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

//Read a file synchronously (blocking)
const data = fs.readFileSync("example.txt", "utf8");
console.log(data);

//Read large files with streams
//Best for big files.
const stream = fs.createReadStream("example.txt", "utf8");

stream.on("data", (chunk) => {
  console.log(chunk);
});

stream.on("error", (err) => {
  console.error(err);
});

// Common gotchas

// Always pass 'utf8' if you want a string (otherwise you get a Buffer)

// File paths are relative to where you run Node, not the file location
// (use __dirname if needed)
// const path = require('path');
// fs.readFile(path.join(__dirname, 'example.txt'), 'utf8', ...)
