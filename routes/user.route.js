const express = require("express");
const router = express.Router();
const { createUser, getAllUsers } = require("../controllers/user.controller");

router.get("/", getAllUsers);
router.post("/", createUser);
