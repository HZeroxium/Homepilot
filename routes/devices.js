// routes/devices.js

const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

// Áp dụng middleware ensureAuthenticated cho tất cả các route
router.use(ensureAuthenticated);

// Hiển thị trang thêm thiết bị
router.get("/add", deviceController.getAddDevicePage);

// Xử lý thêm thiết bị
router.post("/add", deviceController.postAddDevice);

// Display Edit Device Page
router.get("/:deviceId/edit", deviceController.getEditDevicePage);

// Handle Edit Device
router.post("/:deviceId/edit", deviceController.postEditDevice);

// Handle Delete Device
router.post("/:deviceId/delete", deviceController.deleteDevice);

// Hiển thị trang quản lý thiết bị
router.get("/:deviceType", deviceController.getDevicePage);

// Xử lý hành động điều khiển thiết bị
router.post("/:deviceType/action", deviceController.postDeviceAction);

// Chuyển hướng mặc định
router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;
