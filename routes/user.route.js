const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  deleterUser,
  getOneuser,
} = require("../controllers/user.controller");

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getOneuser);
router.delete("/:id", deleterUser);
module.exports = router;
