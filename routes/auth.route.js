const express = require("express");
const router = express.Router();
const { ChangePassword, Login } = require("../controllers/auth.controller");

router.post("/login", Login);
router.post("/change-password", ChangePassword);

module.exports = router;
