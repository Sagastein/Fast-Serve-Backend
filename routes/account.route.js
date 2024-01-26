const app = require("express");
const router = app.Router();
const {
  createAccount,
  getAccountById,
  getAllACount,
  getProfile,
  toggleAccount,
} = require("../controllers/account.controller");
router.post("/", createAccount);
router.get("/profile/:id", getProfile);
router.get("/get/:id", getAccountById);
router.patch("/toggle/:id", toggleAccount); 
router.get("/", getAllACount);
module.exports = router;
