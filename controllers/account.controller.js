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
const getProfile = async (req, res) => {
  const accountId = req.params.id;

  try {
    const user = await Users.findByPk(accountId);
    if (!user) return res.status(404).json({ message: "No users found" });

    const credits = await Transaction.sum("amount", {
      where: {
        UserId: accountId,
        mode: "Credit",
      },
    });

    const balance = await Account.findOne({
      where: {
        UserId: accountId,
      },
      attributes: ["AccountBalance"],
    });

    const debits = await Transaction.sum("amount", {
      where: {
        UserId: accountId,
        mode: "Debit",
      },
    });
    const userStatus = await Account.findOne({
      where: {
        UserId: accountId,
      },
      attributes: ["status"],
    });
    const result = {
      total_credits: credits,
      total_debits: debits,
      balance: balance.AccountBalance,
      userStatus: userStatus.status,
    };

    return res.json({ result: result, status: userStatus.status });
  } catch (error) {
    res.json(error);
  }
};
const toggleAccount = async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    account.status = account.status === "Active" ? "Blocked" : "Active";
    await account.save();
    res.status(200).json(account.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling account status" });
  }
};
module.exports = {
  createAccount,
  getAllACount,
  getAccountById,
  getProfile,
  toggleAccount,
};
