// controllers/deviceController.js
const Device = require("../models/deviceModel");
const mqttClient = require("../config/mqttConfig");

const deviceController = {
  // Hiển thị trang quản lý thiết bị
  getDevicePage: async (req, res, next) => {
    const { deviceType } = req.params;
    const userId = req.session.user.uid;

    try {
      // Lấy thông tin thiết bị
      const device = await Device.getDeviceByType(userId, deviceType);

      if (!device) {
        req.flash("error_msg", "Thiết bị không tồn tại.");
        return res.redirect("/dashboard");
      }

      // Render trang tương ứng với loại thiết bị
      res.render(`devices/${deviceType}`, {
        device,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      console.error("Error in getDevicePage:", error);
      next(error);
    }
  },

  // Xử lý hành động điều khiển thiết bị
  postDeviceAction: async (req, res, next) => {
    const { deviceType } = req.params;
    const { action } = req.body;
    const userId = req.session.user.uid;

    try {
      // Xác thực thiết bị
      const device = await Device.getDeviceByType(userId, deviceType);
      if (!device) {
        req.flash("error_msg", "Thiết bị không tồn tại.");
        return res.redirect("/dashboard");
      }

      // Publish lệnh điều khiển tới MQTT broker
      const topic = `home/${deviceType}/command`;
      const message = JSON.stringify({
        deviceId: device.uid,
        action,
      });

      mqttClient.publish(topic, message, { qos: 1 }, async (err) => {
        if (err) {
          console.error("Error publishing to MQTT:", err);
          req.flash("error_msg", "Không thể gửi lệnh đến thiết bị.");
        } else {
          req.flash("success_msg", "Lệnh đã được gửi tới thiết bị.");

          // Ghi log hành động
          await device.logActivity(action, userId);
        }
        res.redirect(`/devices/${deviceType}`);
      });
    } catch (error) {
      console.error("Error in postDeviceAction:", error);
      next(error);
    }
  },
};

module.exports = deviceController;
