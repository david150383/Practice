const fs = require("fs");

//Write a file asynchronously (recommended)
//Creates the file if it doesn’t exist, overwrites if it does.
fs.writeFile("example.txt", "Hello world!", "utf8", (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("File written!");
});

//Append to a file (don’t overwrite)
//Adds content to the end.
fs.appendFile("example.txt", "\nMore text", "utf8", (err) => {
  if (err) console.error(err);
});

//Write synchronously (blocking)

//Fine for scripts, not servers.
fs.writeFileSync("example.txt", "sync Hello world!", "utf8");
