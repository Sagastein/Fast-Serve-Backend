const { Device } = require("../models");
const createDevice = async (req, res) => {
  try {
    //if not  "name", "price", "location", "status"

    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Device already exists" });
    } else {
      res.status(500).json({ message: "Error Creating Device" });
    }
  }
};
const getAllDevice = async (req, res) => {
  try {
    const devices = await Device.findAll();
    res.status(200).json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving devices" });
  }
};
const getDeviceById = async (req, res) => {
  const deviceId = req.params.id;

  try {
    const device = await Device.findByPk(deviceId);

    if (!device) {
      return res
        .status(404)
        .json({ message: `Device with ID ${deviceId} not found` });
    }

    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving device" });
  }
};
const updateDevice = async (req, res) => {
  const deviceId = req.params.id;

  try {
    const device = await Device.findByPk(deviceId);

    if (!device) {
      return res
        .status(404)
        .json({ message: `Device with ID ${deviceId} not found` });
    }

    await device.update(req.body);

    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating device" });
  }
};
const deleteDevice = async (req, res) => {
  const deviceId = req.params.id;

  try {
    const device = await Device.findByPk(deviceId);

    if (!device) {
      return res
        .status(404)
        .json({ message: `Device with ID ${deviceId} not found` });
    }

    await device.destroy();

    res.json({ message: `Device with ID ${deviceId} deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting device" });
  }
};
//toggle status
const toggleDeviceStatus = async (req, res) => {
  const deviceId = req.params.id;

  try {
    const device = await Device.findByPk(deviceId);
    if (!device) {
      return res
        .status(404)
        .json({ message: `Device with ID ${deviceId} not found` });
    }

    await device.update(req.body);

    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating device" });
  }
};

//toggle mode register or withdraw vircevice if current mode is register change to withdraw vircevice
const toggleDeviceMode = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    device.mode = device.mode === "register" ? "withdraw" : "register";
    await device.save();
    return res
      .status(200)
      .json({ message: "Mode toggled successfully", mode: device.mode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createDevice,
  getAllDevice,
  getDeviceById,
  updateDevice,
  deleteDevice,
  toggleDeviceStatus,
  toggleDeviceMode,
};
