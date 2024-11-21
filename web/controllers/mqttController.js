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
      console.log(`message:_` + message + '_')
      console.log(`topic: ` + topic)
      const payload = JSON.parse(message.toString());
      const [home, userId, deviceType, deviceId, messageType] =
        topic.split("/");

      console.log(`Received message from ${deviceType}:`, payload);
      console.log(`Message type: ${messageType}`);

      if (messageType === "data") {
        // const deviceId = payload.deviceId;
        const deviceStatus = payload.status;
        const deviceData = payload.data || {};
        // Cập nhật trạng thái thiết bị trong Firestore
        const device = await Device.getDeviceById(deviceId);
        if (device) {
          if (deviceStatus) {
            await device.updateStatus(deviceStatus);
            console.log(
              `Updated status for device ${deviceId} to ${deviceStatus}`
            );
          }
          // if (deviceData) {
          //   await device.updateData(deviceData);
          //   console.log(`Updated data for device ${deviceId} to`, deviceData);
          // }

          if (device.type === "fire_smoke" && deviceData) {
            // Kiểm tra nhiệt độ và độ ẩm
            if (deviceData.temperature > 50 || deviceData.humidity > 80) {
              // Gửi email cảnh báo
              // ...
              console.log("Alert! Temperature or humidity is too high");
              deviceData.alertStatus = true;
            }

            const historicalData = {
              temperature: deviceData.temperature || 0,
              humidity: deviceData.humidity || 0,
              light: deviceData.light || 0,
              alertStatus: deviceData.alertStatus ? "Danger" : "Normal",
            }
            console.log(historicalData)

            await device.saveHistoricalData(historicalData);

            console.log(`Saved historical data for device ${deviceId}`);
          } else if (device.type === "access_control" && deviceData) {
            // Kiểm tra trạng thái cửa
            await device.saveHistoricalData({
              method: deviceData.method,
              status: deviceStatus,
            });
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
  });
};

module.exports = mqttController;
