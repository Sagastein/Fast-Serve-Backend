const moment = require("moment");
const { Op } = require("sequelize");
const { Account, Transaction, sequelize } = require("../models");
const dashboardStatus = async (req, res) => {
  try {
    const totalUsers = await Account.count();
    const activeUsers = await Account.count({ where: { status: "Active" } });
    const blockedUsers = await Account.count({ where: { status: "Blocked" } });

    res.json({ totalUsers, activeUsers, blockedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const TodayTransaction = async (req, res) => {
  try {
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

    const debitTotal = Number(
      await Transaction.sum("amount", {
        where: {
          mode: "Debit",
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

    const creditTotal = Number(
      await Transaction.sum("amount", {
        where: {
          mode: "Credit",
        },
      })
    );

    const debitPercentage =
      debitTotal !== 0 ? ((debitTotalToday / debitTotal) * 100).toFixed(2) : 0;
    const creditPercentage =
      creditTotal !== 0
        ? ((creditTotalToday / creditTotal) * 100).toFixed(2)
        : 0;

    res.json({
      debitTotalToday,
      debitTotal,
      debitPercentage,
      creditTotalToday,
      creditTotal,
      creditPercentage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const WeekTransactions = async (req, res) => {
  try {
    // Get the current week's start and end dates
    const weekStart = moment().startOf("week");
    const weekEnd = moment().endOf("week");

    // Get the debit and credit totals for the current week
    const debitTotal = await Transaction.sum("amount", {
      where: {
        mode: "Debit",
        createdAt: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    const creditTotal = await Transaction.sum("amount", {
      where: {
        mode: "Credit",
        createdAt: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    // Calculate the percentages
    const total = debitTotal + creditTotal;
    const debitPercentage =
      debitTotal !== 0 ? ((debitTotal / total) * 100).toFixed(2) : 0;
    const creditPercentage =
      creditTotal !== 0 ? ((creditTotal / total) * 100).toFixed(2) : 0;

    // Send the response
    res.json({ debitTotal, creditTotal, debitPercentage, creditPercentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const chartdata = async (req, res) => {
  try {
    const todayEnd = moment().endOf("day").toDate();
    const transactions = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.lte]: todayEnd,
        },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              'CASE WHEN "mode" = \'Credit\' THEN "amount" ELSE 0 END'
            )
          ),
          "creditTotal",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              'CASE WHEN "mode" = \'Debit\' THEN "amount" ELSE 0 END'
            )
          ),
          "debitTotal",
        ],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      raw: true,
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const eatenToday = async (req, res) => {
  const alltransactions = await Transaction.findAndCountAll({
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

  res.json(alltransactions);
};
module.exports = {
  dashboardStatus,
  TodayTransaction,
  WeekTransactions,
  chartdata,
  eatenToday,
};
