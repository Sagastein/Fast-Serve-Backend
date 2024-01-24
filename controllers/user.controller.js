const { Users, Account, Transaction } = require("../models");
const bcrypt = require("bcrypt");
require("dotenv").config();
const getAllUsers = async (req, res) => {
  try {
    const accounts = await Users.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(accounts);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
const createUser = async (req, res) => {
  try {
    const { UserId, email, tel, password, fullName, gender } = req.body;
    if (!UserId || !email || !tel || !fullName || !gender) {
      return res.status(400).json({
        error: "All Fields Are Required",
      });
    }
    const userWithId = await Users.findOne({ where: { UserId } });
    const userWithEmail = await Users.findOne({ where: { email } });
    const userWithPhone = await Users.findOne({ where: { tel } });
    if (userWithId || userWithEmail || userWithPhone) {
      return res.status(400).json({
        error: "User already exists with this id, email, or phone",
      });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash(process.env.DefaultStudentPassword, 10);

    const result = await Users.create({
      UserId,
      email,
      tel,
      fullName,
      gender,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Data inserted successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Error inserting data",
    });
  }
};
export { getAllUsers };
