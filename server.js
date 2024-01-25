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
} = require("./routes");

var corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", AuthRouter);
// app.use("/api/account", AccountRouter);
app.use("/api/device", DeviceRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/users", UserRouter);
const port = 8080;
const cardIds = [];
app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  cardIds.push(id);
  res.status(200).json(id);
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
