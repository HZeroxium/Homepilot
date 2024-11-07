// controllers/dashboardController.js
const Device = require("../models/deviceModel");

const dashboardController = {
  // Hiển thị trang dashboard
  getDashboard: async (req, res, next) => {
    try {
      // Lấy danh sách các thiết bị của người dùng
      const devices = await Device.getDevicesByUserId(req.session.user.uid);

      // Chuẩn bị dữ liệu cho giao diện
      res.render("dashboard", {
        user: req.session.user,
        devices,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      console.error("Error in getDashboard:", error);
      next(error);
    }
  },
};

module.exports = dashboardController;
