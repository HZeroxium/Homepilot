// routes/devices.js
const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

// Áp dụng middleware ensureAuthenticated cho tất cả các route
router.use(ensureAuthenticated);

// Hiển thị trang quản lý thiết bị
router.get("/:deviceType", deviceController.getDevicePage);

// Xử lý hành động điều khiển thiết bị
router.post("/:deviceType/action", deviceController.postDeviceAction);

module.exports = router;
