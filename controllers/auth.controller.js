const { Users, Account, Transaction } = require("../models");
const bcrypt = require("bcrypt");
const { SendEmail } = require("../config/Email.config");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(404).json({ message: "All fields are required" });

    const user = await Users.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials(Password)" });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res
      .cookie("token", token, {
        secure: false,
        maxAge: 3600000,
      })
      .json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error during login" });
  }
};
