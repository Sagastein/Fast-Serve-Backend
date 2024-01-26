const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const {
  AccountRouter,
  DeviceRouter,
  TransactionRouter,
  UserRouter,
  AuthRouter,
  DashboardRouter,
} = require("./routes");
const { Account, Transaction, Device } = require("./models");

var corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api/device", DeviceRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/users", UserRouter);
app.use("/api/accounts", AccountRouter);
app.use("/api/dashboards", DashboardRouter);
const port = 8080;
const cardIds = [];
// app.get("/get/:id", (req, res) => {
//   const id = req.params.id;
//   cardIds.push(id);
//   res.status(200).json(id);
// });
app.get("/get/:id/:deviceId", async (req, res) => {
  try {
    const { id, deviceId } = req.params;

    // Check if the device exists in the database
    const device = await Device.findOne({ where: { id: deviceId } });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Check the mode of the device
    if (device.mode === "register") {
      cardIds.push(id);
      return res.status(200).json(id);
    } else if (device.mode === "withdraw") {
      const user = await Account.findByPk(id);

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

      const newBalance = await Account.findByPk(id);
      return res.status(201).json({
        message: `Transaction successfully made new balance :${newBalance.AccountBalance}`,
        newBalance: newBalance,
      });
    } else {
      // Handle other modes if needed
      return res.status(400).json({ message: "Invalid mode" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/ca", (req, res) => {
  if (cardIds.length === 0) {
    return res.status(200).json("waiting ..");
  }
  const cardId = cardIds.shift(); // Get the oldest card ID and remove it
  return res.status(200).json(cardId);
});
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database is connected");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
