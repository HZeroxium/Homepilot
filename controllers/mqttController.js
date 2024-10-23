// controllers/mqttController.js
const mqttClient = require("../config/mqttConfig");
const Device = require("../models/deviceModel");
const nodemailer = require("nodemailer");

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Hoặc dịch vụ email bạn sử dụng
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mqttController = (io) => {
  mqttClient.on("message", async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      let [home, deviceType, messageType] = topic.split("/");

      console.log(`Received message from ${deviceType}:`, payload);
      console.log(`Message type: ${messageType}`);

      if (messageType === "status") {
        const deviceId = payload.deviceId;
        const deviceStatus = payload.status;
        const deviceData = payload.data || {};

        // Cập nhật trạng thái thiết bị trong Firestore
        const device = await Device.getDeviceById(deviceId);
        if (device) {
          await device.updateStatus(deviceStatus);
          await device.updateData(deviceData);
          console.log(`Updated status for device ${deviceId}`);

          if (device.type === "fire_smoke") {
            await device.saveHistoricalData({
              temperature: deviceData.temperature,
              humidity: deviceData.humidity,
              alertStatus: deviceData.alertStatus,
            });

            console.log(`Saved historical data for device ${deviceId}`);
          }

          // Phát sự kiện tới client qua Socket.io
          io.to(device.userId).emit("deviceDataUpdate", {
            deviceId,
            deviceType,
            data: deviceData,
          });

          console.log(`Emitted deviceDataUpdate for device ${deviceId}`);
        } else {
          console.warn(`Device ${deviceId} not found`);
        }
      }
    } catch (error) {
      console.error("Error handling MQTT message:", error);
    }

    // if (messageType === "alert") {
    //   const alertType = payload.alertType;
    //   const alertMessage = payload.message;

    //   // Lấy thông tin thiết bị và người dùng
    //   const device = await Device.getDeviceById(payload.deviceId);
    //   if (device) {
    //     const user = await User.findById(device.userId);
    //     if (user && user.fcmToken) {
    //       // Gửi thông báo tới người dùng
    //       const notification = {
    //         title: "Cảnh báo từ hệ thống",
    //         body: alertMessage,
    //       };
    //       const message = {
    //         token: user.fcmToken,
    //         notification,
    //       };
    //       await messaging.send(message);
    //       console.log(`Sent notification to user ${user.uid}`);
    //     }
    //   }
    // }
  });
};

module.exports = mqttController;
