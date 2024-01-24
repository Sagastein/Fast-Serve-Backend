const express = require("express");
const router = express.Router();
const {
  toggleDeviceStatus,
  createDevice,
  deleteDevice,
  getAllDevice,
  getDeviceById,
} = require("../controllers/device.controller");
router.get("/", getAllDevice);
router.get("/:id", getDeviceById);
router.post("/", createDevice);
router.put("/status/:id", toggleDeviceStatus);
router.delete("/:id", deleteDevice);
module.exports = router;
