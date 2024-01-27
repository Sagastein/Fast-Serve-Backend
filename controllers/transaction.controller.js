const { Users, Account, Transaction } = require("../models");
const moment = require("moment");
function calculateTimeAgo(date) {
  return moment(date, "DD-MM-YYYY HH:mm:ss").fromNow();
}

const getAllTransactions = async (req, res) => {
  try {
    const users = await Transaction.findAll();
    if (users.length == 0) {
      return res.status(404).json({ message: "Empty transactions found" });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ err: "Error fetching Transactions", error: error });
  }
};
const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Account,
          attributes: ["AccountBalance"],
          include: [
            {
              model: Users,
              attributes: ["fullName"],
            },
          ],
        },
      ],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    const recentTransactions = transactions.map((transaction) => ({
      id: transaction.UUID,
      userid: transaction.UserId,
      username: transaction.Account.User.fullName,
      amount: transaction.amount,
      transactionType: transaction.mode,
      accountBalance: transaction.Account.AccountBalance,
      timeAgo: calculateTimeAgo(transaction.createdAt),
    }));

    res.json(recentTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving recent transactions" });
  }
};
const payment = async (req, res) => {
  try {
    const { Id } = req.body;
    const user = await Account.findByPk(Id);
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (user.status === "Blocked") {
      return res.status(403).json({ message: "User blocked" });
    }
    if (user.AccountBalance < 500) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    await Transaction.create({
      mode: "Credit",
      amount: 500,
      UserId: user.UserId,
    });
    user.AccountBalance -= 500;
    await user.save();
    const newbalance = await Account.findByPk(Id);
    res.json(newbalance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating transaction" });
  }
};
const deposit = async (req, res) => {
  try {
    const { Id, amount } = req.body;
    if (!amount || !Id)
      return res
        .status(403)
        .json({ message: "Please Enter Amount and Card Id" });

    const user = await Account.findByPk(Id);
    if (!user)
      return res
        .status(404)
        .json({ error: "No Account Found Associated With this Card" });
    if (user.status === "Blocked")
      return res
        .status(404)
        .json({ error: "Account blocked 😜, Contact Admin" });
    //amoutnis a number
    if (isNaN(amount))
      return res.status(403).json({ error: "Amount should be a number" });
    await Transaction.create({
      mode: "Debit",
      amount: amount,
      UserId: user.UserId,
    });

    user.AccountBalance = +user.AccountBalance + Number(amount);
    await user.save();

    res.json({ AccountBalance: user.AccountBalance });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Inserting Transactions", err: error });
  }
};
const deleteTransaction = async (req, res) => {
  try {
    const { UUID } = req.params;
    const affectedRows = await Transaction.destroy({ where: { UUID } });
    if (!affectedRows) {
      return res.status(404).send({ error: "Transaction not found" });
    }
    res.status(200).send({ message: "transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting Transaction", error: error });
  }
};
const getTransactionsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Transaction.findAll({ where: { UserId: id } });
    if (user.length == 0) {
      return res
        .status(404)
        .json({ error: `No Transactions found with this ${id} Account Id` });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching Transactions", error: error });
  }
};
module.exports = {
  getAllTransactions,
  getRecentTransactions,
  payment,
  deposit,
  deleteTransaction,
  getTransactionsByUser,
};
