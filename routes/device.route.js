const express = require("express");
const router = express.Router();
const {
  toggleDeviceStatus,
  createDevice,
  deleteDevice,
  getAllDevice,
  getDeviceById,
  toggleDeviceMode,
} = require("../controllers/device.controller");
router.get("/", getAllDevice);
router.get("/:id", getDeviceById);
router.post("/", createDevice);
router.put("/status/:id", toggleDeviceStatus);
router.delete("/:id", deleteDevice);
router.patch("/mode/:id", toggleDeviceMode);
module.exports = router;
