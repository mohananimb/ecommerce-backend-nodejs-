const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/user", async (req, res) => {
  try {
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
      return res.status(400).send({
        message: "This User is already exist.",
      });
    }

    const user = new User(req.body);
    await user.save();
    return res.status(201).send({
      message: "User create successfully",
      user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({
        message: "User not found",
      });
    }

    const match = await user.passwordCheck(req.body.password);
    if (!match) {
      return res.status(400).send({
        message: "Invalid Password",
      });
    }

    const token = await user.generateToken();

    const { _id, name, email, role, mobile } = user;

    return res.status(200).send({
      message: "Logged In Successfully",
      user: { _id, name, email, role, mobile, token },
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/profile", auth, async (req, res) => {
  res.status(200).send("HI");
});

module.exports = router;
