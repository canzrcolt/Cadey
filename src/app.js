const express = require("express");
const path = require("path");
const router = express.Router();
const app = express();

app.use(express.static("assets"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(5000, () => {
  console.log("App listening on port 5000!");
});
