const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// GET: Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

// POST: Register User
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

// GET: Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// POST: Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.send("User not found");
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.send("Incorrect password");

    // Save user in session
    req.session.user = user;
    res.redirect("/employees");
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});

// GET: Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
