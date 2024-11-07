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

      // Lấy dữ liệu lịch sử nếu là thiết bị fire_smoke
      let historicalData = [];
      if (device.type === "fire_smoke") {
        historicalData = await device.getHistoricalData(20); // Lấy 20 điểm dữ liệu gần nhất
      }

      // Render trang tương ứng với loại thiết bị
      res.render(`devices/${deviceType}`, {
        device,
        historicalData,
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

      // Publish lệnh điều khiển tới MQTT broker với cấu trúc topic mới
      const topic = `home/${userId}/${deviceType}/${device.uid}/command`;
      const message = JSON.stringify({
        deviceId: device.uid,
        action,
      });

      // if (deviceType === "access_control") {

      // }

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

  // Hiển thị trang thêm thiết bị
  getAddDevicePage: (req, res) => {
    res.render("devices/add_device", {
      title: "Thêm thiết bị",
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    });
  },

  // Xử lý thêm thiết bị
  postAddDevice: async (req, res) => {
    const userId = req.session.user.uid;
    const { type, name } = req.body;

    try {
      // Kiểm tra đầu vào
      if (!type || !name) {
        req.flash("error_msg", "Vui lòng nhập đầy đủ thông tin.");
        return res.redirect("/devices/add");
      }

      // Tạo thiết bị mới
      const device = await Device.createDevice(userId, type, name);

      req.flash("success_msg", "Thiết bị đã được thêm thành công.");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error adding device:", error);
      req.flash("error_msg", "Đã xảy ra lỗi khi thêm thiết bị.");
      res.redirect("/devices/add");
    }
  },

  // Display Edit Device Page
  getEditDevicePage: async (req, res, next) => {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;

    try {
      // Fetch device by ID
      const device = await Device.getDeviceById(deviceId);

      // Check if device exists and belongs to the user
      if (!device || device.userId !== userId) {
        req.flash(
          "error_msg",
          "Thiết bị không tồn tại hoặc bạn không có quyền truy cập."
        );
        return res.redirect("/dashboard");
      }

      res.render("devices/edit_device", {
        title: "Chỉnh Sửa Thiết Bị",
        device,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      console.error("Error in getEditDevicePage:", error);
      next(error);
    }
  },

  // Handle Edit Device
  postEditDevice: async (req, res, next) => {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;
    const { name, type } = req.body;

    try {
      // Fetch device by ID
      const device = await Device.getDeviceById(deviceId);

      // Check if device exists and belongs to the user
      if (!device || device.userId !== userId) {
        req.flash(
          "error_msg",
          "Thiết bị không tồn tại hoặc bạn không có quyền truy cập."
        );
        return res.redirect("/dashboard");
      }

      // Validate input
      if (!name || !type) {
        req.flash("error_msg", "Vui lòng nhập đầy đủ thông tin.");
        return res.redirect(`/devices/${deviceId}/edit`);
      }

      // Update device info
      await device.updateDeviceInfo({ name, type });

      req.flash("success_msg", "Thiết bị đã được cập nhật thành công.");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error in postEditDevice:", error);
      next(error);
    }
  },

  // Handle Delete Device
  deleteDevice: async (req, res, next) => {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;

    try {
      // Fetch device by ID
      const device = await Device.getDeviceById(deviceId);

      // Check if device exists and belongs to the user
      if (!device || device.userId !== userId) {
        req.flash(
          "error_msg",
          "Thiết bị không tồn tại hoặc bạn không có quyền truy cập."
        );
        return res.redirect("/dashboard");
      }

      // Delete device
      await device.delete();

      req.flash("success_msg", "Thiết bị đã được xóa thành công.");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error in deleteDevice:", error);
      next(error);
    }
  },

  // Hiển thị trang thay đổi mật khẩu
  getChangePasswordPage: async (req, res, next) => {
    const userId = req.session.user.uid;
    const deviceType = "access_control";

    try {
      const device = await Device.getDeviceByType(userId, deviceType);

      if (!device) {
        req.flash("error_msg", "Thiết bị không tồn tại.");
        return res.redirect("/dashboard");
      }

      res.render("devices/change_password", {
        device,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      console.error("Error in getChangePasswordPage:", error);
      next(error);
    }
  },

  // Xử lý thay đổi mật khẩu
  postChangePassword: async (req, res, next) => {
    const userId = req.session.user.uid;
    const deviceType = "access_control";
    const { newPassword, confirmPassword } = req.body;

    try {
      const device = await Device.getDeviceByType(userId, deviceType);

      if (!device) {
        req.flash("error_msg", "Thiết bị không tồn tại.");
        return res.redirect("/dashboard");
      }

      // Kiểm tra mật khẩu mới
      if (!newPassword || newPassword !== confirmPassword) {
        req.flash("error_msg", "Mật khẩu không khớp.");
        return res.redirect("/devices/access_control/change_password");
      }

      // Cập nhật mật khẩu
      await device.updatePassword(newPassword);

      // Gửi lệnh cập nhật mật khẩu đến thiết bị qua MQTT
      const topic = `home/${userId}/access_control/${device.uid}/command`;
      const message = JSON.stringify({
        deviceId: device.uid,
        action: "update_pin",
        parameters: newPassword,
      });

      mqttClient.publish(topic, message, { qos: 1 }, async (err) => {
        if (err) {
          console.error("Error publishing to MQTT:", err);
          req.flash("error_msg", "Không thể gửi lệnh đến thiết bị.");
        } else {
          req.flash("success_msg", "Mật khẩu đã được cập nhật thành công.");
        }
        res.redirect("/devices/access_control");
      });
    } catch (error) {
      console.error("Error in postChangePassword:", error);
      next(error);
    }
  },
};

module.exports = deviceController;
