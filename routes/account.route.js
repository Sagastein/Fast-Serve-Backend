const app = require("express");
const router = app.Router();
const {
  createAccount,
  getAccountById,
  getAllACount,
} = require("../controllers/account.controller");
router.post("/create", createAccount);
router.get("/get/:id", getAccountById);
router.get("/", getAllACount);
module.exports = router;
