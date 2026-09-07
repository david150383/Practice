const fs = require("fs");
const data = fs.createReadStream("example.txt", "utf-8");
data.on("data", (data) => {
    console.log(data);
})