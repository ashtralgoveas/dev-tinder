const express = require("express");

const app = express();

app.get(
  "/user/:userId",
  (req, res, next) => {
    console.log("route 1");
    next();
  },
  [
    (req, res, next) => {
      console.log("route 2");
      next();
    },
  ],
  [
    (req, res, next) => {
      console.log("route 3");
      res.send({ name: "Ash", age: 22 });
    },
  ],
);

app.use("/", (req, res) => {
  res.send("Home route is working");
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
