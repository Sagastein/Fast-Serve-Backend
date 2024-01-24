const { Account, Transaction, Users } = require("../models");
const createAccount = async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.status(201).json(account);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Account already exists" });
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
      res.status(400).json({ message: "User does not exist" });
    } else {
      res.status(500).json({ message: "Error Creating Account" });
    }
  }
};
const getAllACount = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving accounts" });
  }
};
const getAccountById = async (req, res) => {
  const accountId = req.params.id;

  try {
    const account = await Account.findByPk(accountId);

    if (!account) {
      return res
        .status(404)
        .json({ message: `Account with ID ${accountId} not found` });
    }

    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving account" });
  }
};
module.exports = { createAccount, getAllACount, getAccountById };
