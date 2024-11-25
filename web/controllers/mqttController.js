// mqttController.js

import mqttClient from "../config/mqttConfig.js";
import Device from "../models/deviceModel.js";
import sendDevicesNotification from "../utils/sendDevicesNotification.js";
import sendEmail from "../utils/sendEmail.js";
import dotenv from 'dotenv';

dotenv.config();

let lastNotificationTime = 0;
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
            if (deviceData.temperature > 50 || deviceData.humidity > 80) {
              const currentTime = Date.now();
              if (currentTime - lastNotificationTime >= 10 * 60 * 1000) {
                // Send notification to user's phone
                await sendDevicesNotification({
                  message:"Alert! Temperature or humidity is too high", 
                  title:"Notification", 
                  deviceId:process.env.PUSHSAFER_DEVICE_ID
                });
                
                // Send email to user
                await sendEmail({
                  to:process.env.EMAIL_RECEIVER, 
                  from:process.env.EMAIL_SENDER, 
                  subject:'[HOMEPILOT] NOTIFICATION', 
                  text:'HomePilot Notification', // Plain text fallback
                  device_name: "Fire and Smoke System",
                  temperature: deviceData.temperature,
                });
                lastNotificationTime = currentTime;
              }
              console.log("Alert! Temperature or humidity is too high");
              deviceData.alertStatus = true;
            }
             /**
             * Saves the historical data for the device.
             */
            const historicalData = {
              temperature: deviceData.temperature || 0,
              humidity: deviceData.humidity || 0,
              light: deviceData.light || 0,
              alertStatus: deviceData.alertStatus ? "Danger" : "Normal",
            }

            await device.saveHistoricalData(historicalData);

            // console.log(`Saved historical data for device ${deviceId}`);
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
