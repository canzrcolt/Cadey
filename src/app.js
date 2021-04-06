const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const validation = require("@hapi/joi");

//Import Routes
const authRoute = require("./routes/auth");

dotenv.config();

//connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db")
);

//Middleware
app.use(express.json());

//Route Middlewares
app.use("/api/user", authRoute);

app.use(express.static("assets"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(5000, () => {
  console.log("App listening on port 5000!");
});
