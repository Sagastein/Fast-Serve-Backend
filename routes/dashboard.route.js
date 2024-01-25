const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Op } = require("sequelize");
const { Account, Transaction, sequelize } = require("../models");
const {
  dashboardStatus,
  TodayTransaction,
  WeekTransactions,
  chartdata,
  eatenToday,
  income,
  statistics,
  allWeeklyTransaction,
} = require("../controllers/dashboard.controller");
router.get("/status", dashboardStatus);
router.get("/transactions/today", TodayTransaction);
router.get("/transactions/weekly", WeekTransactions);
router.get("/transactions/all", allWeeklyTransaction);
router.get("/chartdata", chartdata);
router.get("/eatentoday", eatenToday);
router.get("/stats", statistics);
router.get("/income", income);

module.exports = router;
