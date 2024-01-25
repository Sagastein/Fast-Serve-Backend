const express = require("express");
const router = express.Router();
const { Account, Transaction, Users } = require("../models");
const moment = require("moment");
const {
  getAllTransactions,
  getRecentTransactions,
  payment,
  deposit,
} = require("../controllers/transaction.controller");

router.get("/", getAllTransactions);
router.get("/recent", getRecentTransactions);
router.post("/", deposit);
router.post("/payment", payment);

module.exports = router;
