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
export { getAllUsers };
