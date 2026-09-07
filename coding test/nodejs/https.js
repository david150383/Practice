const https = require("https");
https.get("https://jsonplaceholder.typicode.com/posts/1", (res) => {
  // Check for successful response
  if (res.statusCode !== 200) {
    console.error(`Request failed. Status code: ${res.statusCode}`);
    res.resume(); // consume response data to free memory
    return;
  }

  let data = "";
  // Collect data chunks
  res.on("data", (chunk) => {
    data += chunk;
  });

  // Parse JSON when complete
  res.on("end", () => {
    try {
      const records = JSON.parse(data);
      console.log(records);
    } catch (err) {
      console.error("Error parsing JSON:", err.message);
    }
  });
});
