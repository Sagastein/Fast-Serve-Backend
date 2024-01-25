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
} = require("../controllers/dashboard.controller");
router.get("/status", dashboardStatus);

router.get("/transactions/today", TodayTransaction);

router.get("/transactions/weekly", WeekTransactions);

router.get("/transactions/all", async (_, res) => {
  try {
    const weekStart = moment().startOf("isoWeek").isoWeekday(1);
    const weekEnd = moment().endOf("isoWeek").isoWeekday(7);

    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");

    const debitTotalToday = Number(
      await Transaction.sum("amount", {
        where: {
          mode: "Debit",
          createdAt: {
            [Op.between]: [todayStart, todayEnd],
          },
        },
      })
    );
    const debitTotalWeek = Number(
      await Transaction.sum("amount", {
        where: {
          mode: "Debit",
          createdAt: {
            [Op.between]: [weekStart, weekEnd],
          },
        },
      })
    );

    const creditTotalToday = Number(
      await Transaction.sum("amount", {
        where: {
          mode: "Credit",
          createdAt: {
            [Op.between]: [todayStart, todayEnd],
          },
        },
      })
    );
    const creditTotalWeek = Number(
      await Transaction.sum("amount", {
        where: {
          mode: "Credit",
          createdAt: {
            [Op.between]: [weekStart, weekEnd],
          },
        },
      })
    );

    // Get the debit and credit totals for the current week
    const debitTotal = await Transaction.sum("amount", {
      where: {
        mode: "Debit",
      },
    });

    const creditTotal = await Transaction.sum("amount", {
      where: {
        mode: "Credit",
      },
    });

    // Calculate the percentages
    const debitPercentageToday =
      debitTotal !== 0 ? ((debitTotalToday / debitTotal) * 100).toFixed(2) : 0;
    const creditPercentageToday =
      creditTotal !== 0
        ? ((creditTotalToday / creditTotal) * 100).toFixed(2)
        : 0;
    const debitPercentageWeekly =
      debitTotal !== 0 ? ((debitTotalWeek / debitTotal) * 100).toFixed(2) : 0;
    const creditPercentageWeekly =
      creditTotal !== 0
        ? ((creditTotalWeek / creditTotal) * 100).toFixed(2)
        : 0;

    // Send the response
    res.json({
      debitTotalToday,
      debitTotal,
      debitPercentageToday,
      debitPercentageWeekly,
      creditTotalToday,
      creditTotal,
      debitTotalWeek,
      creditTotalWeek,
      creditPercentageToday,
      creditPercentageWeekly,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/chartdata", chartdata);

router.get("/eatentoday", eatenToday);

//get total users total debits, total credits, total credits today
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await Account.count();
    const totalDebits = await Transaction.sum("amount", {
      where: {
        mode: "Debit",
      },
    });
    const totalCredits = await Transaction.sum("amount", {
      where: {
        mode: "Credit",
      },
    });
    const totalCreditsToday = await Transaction.sum("amount", {
      where: {
        mode: "Credit",
        createdAt: {
          [Op.between]: [
            moment().startOf("day").toDate(),
            moment().endOf("day").toDate(),
          ],
        },
      },
    });

    res.json({ totalUsers, totalDebits, totalCredits, totalCreditsToday });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//calcalute increase or decrease in percentage of today income from yesterday income
//what should be done if yesterday income is not available or today income is not available

router.get("/income", async (_, res) => {
  try {
    const today = await Transaction.sum("amount", {
      where: {
        mode: "Credit",
        createdAt: {
          [Op.between]: [
            moment().startOf("day").toDate(),
            moment().endOf("day").toDate(),
          ],
        },
      },
    });

    const yesterday = await Transaction.sum("amount", {
      where: {
        mode: "Credit",
        createdAt: {
          [Op.between]: [
            moment().subtract(1, "days").startOf("day").toDate(),
            moment().subtract(1, "days").endOf("day").toDate(),
          ],
        },
      },
    });

    const todayIncome = today || 0;
    const yesterdayIncome = yesterday || 0;
    const percentage =
      ((todayIncome - yesterdayIncome) / yesterdayIncome) * 100 || 0;

    res.json({ today: todayIncome, yesterday: yesterdayIncome, percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
