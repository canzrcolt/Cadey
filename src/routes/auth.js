const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //validate data before adding user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check if user is in database already
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email already exists");

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send();
  }
});

//login
router.post("/login", async (req, res) => {
  //Validate data before user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //checking if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email or password is wrong");
  //checking if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid email or password");
  //Create and Assign Token

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
