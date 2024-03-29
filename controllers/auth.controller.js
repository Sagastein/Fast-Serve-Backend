const { Users, Account, Transaction } = require("../models");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

    const token = jwt.sign({ user }, "sadfjlnsda", {
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

const ChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(404).json({ message: "All fields are required" });

    const user = await Users.findOne({ where: { UserId: id } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials(Password)" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await Users.update(
      { password: hashedPassword },
      { where: { id } }
    );
    res.status(201).json({
      message: "Password Changed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Error during login", error });
  }
};
module.exports = { Login, ChangePassword };
