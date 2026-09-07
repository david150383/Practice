const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors()); 
app.use(express.json());
app.use((req, res, next) => {
  console.log("middleware");
  next();
});
const users = [
  { id: 1, name: "customer 1" },
  { id: 2, name: "customer 2" },
  { id: 3, name: "customer 3" },
  { id: 4, name: "customer 4" },
  { id: 5, name: "customer 5" },
];
app.get("/users", (req, res) => {
  res.status(200).send(users);
});
app.post("/users", (req, res) => {
  let user = req.body;
  console.log(user);
  user.id = users.length + 1;
  users.push(user);
  res.send(user).status(2001);
});
app.use((req, res) => {
  res
    .status(404)
    .send(
      "<h1>404 Not Found: Sorry, the requested resource was not found!</h1>",
    );
});

app.listen(4000, () => {
  console.log("app running");
});
