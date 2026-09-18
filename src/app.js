const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("test route is working");
});

app.use("/", (req, res) => {
  res.send("Home route is working");
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
