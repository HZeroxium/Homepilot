// mqttController.js

import mqttClient from "../config/mqttConfig.js";
import Device from "../models/deviceModel.js";
import nodemailer from "nodemailer";

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or the email service you use
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Handles MQTT messages from devices.
 * @param {Object} io - The Socket.IO server.
 */
const mqttController = (io) => {
  /**
   * Handles MQTT messages from devices.
   * @param {string} topic - The topic of the MQTT message.
   * @param {Buffer} message - The message from the MQTT broker.
   */
  mqttClient.on("message", async (topic, message) => {
    try {
      /**
       * Parses the message payload and extracts the home, user ID, device type, device ID, and message type.
       * @type {Object}
       */
      const payload = JSON.parse(message.toString());
      const [home, userId, deviceType, deviceId, messageType] =
        topic.split("/");

      console.log(`Received message from ${deviceType}:`, payload);
      console.log(`Message type: ${messageType}`);

      if (messageType === "data") {
        /**
         * Updates the device status and historical data.
         */
        const deviceStatus = payload.status;
        const deviceData = payload.data || {};

        const device = await Device.getDeviceById(deviceId);
        if (device) {
          if (deviceStatus) {
            /**
             * Updates the device status.
             */
            await device.updateStatus(deviceStatus);
            console.log(
              `Updated status for device ${deviceId} to ${deviceStatus}`
            );
          }

          if (device.type === "fire_smoke" && deviceData) {
            /**
             * Checks if the temperature and humidity levels are unsafe and sends an email if so.
             */
            const { temperature, humidity } = deviceData;
            if (temperature > 50 || humidity > 80) {
              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: "Fire Alert",
                text: `Device ${deviceId} detected unsafe temperature or humidity levels.`,
              };

              /**
               * Sends an email to the user.
               */
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Error sending email:", error);
                } else {
                  console.log("Email sent:", info.response);
                }
              });

              deviceData.alertStatus = true;
            }

            /**
             * Saves the historical data for the device.
             */
            await device.saveHistoricalData({
              temperature: deviceData.temperature,
              humidity: deviceData.humidity,
              alertStatus: deviceData.alertStatus ? "Danger" : "Normal",
            });

            console.log(`Saved historical data for device ${deviceId}`);
          }

          /**
           * Emits the device data update event to the user's socket.
           */
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

export default mqttController;
