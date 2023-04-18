const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

router.get("/index", (req, res) => {
  res.render("index");
});
router.get("/contact", auth, (req, res) => {
  res.render("contact");
});
router.get("/logout", auth, async (req, res) => {
  try {
    // req.userPass.tokens = req.userPass.tokens.filter(currEle => {
    //   return currEle.token !== req.token;
    // });
    req.userPass.tokens=[]
    res.clearCookie("jwt");
    await req.userPass.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  try {
    const pass = req.body.password;
    const cpass = req.body.confirmpassword;
    if (pass === cpass) {
      const registerUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword
      });

      const token = await registerUser.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 3000000),
        // httpOnly: true
      });

      const registered = await registerUser.save();
      res.status(201).render("login");
    } else {
      res.send("Incorrect Login Details");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login Validation

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await User.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000),
      // httpOnly: true
    });

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("Invalid Login Details");
    }
  } catch (error) {
    res.status(400).send("Invalid Login Details");
  }
});

module.exports = router;
