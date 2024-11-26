// services/mqttService.js

import Device from '../models/device.model.js';
import NotificationService from './notification.service.js';

class MqttService {
  static lastNotificationTime = 0;

  static async handleDeviceData({ topic, payload }) {
    const [home, userId, deviceType, deviceId, messageType] = topic.split('/');

    if (messageType !== 'data') return;

    const device = await Device.getDeviceById(deviceId);
    if (!device) {
      console.warn(`Device ${deviceId} not found`);
      return;
    }

    const { status: deviceStatus, data: deviceData = {} } = payload;

    // Update device status
    if (deviceStatus) {
      await device.updateStatus(deviceStatus);
      console.log(`Updated status for device ${deviceId} to ${deviceStatus}`);
    }

    // Handle fire_smoke devices
    if (device.type === 'fire_smoke') {
      await this.handleFireSmokeDevice(device, deviceData, userId);
    }

    return { device, deviceType, deviceData, userId };
  }

  static async handleFireSmokeDevice(device, deviceData, userId) {
    const { temperature = 0, humidity = 0 } = deviceData;

    // Check for high temperature/humidity and send notifications
    if (temperature > 50 || humidity > 80) {
      const currentTime = Date.now();
      if (currentTime - this.lastNotificationTime >= 10 * 60 * 1000) {
        await NotificationService.sendDevicesNotification({
          message: 'Alert! Temperature or humidity is too high',
          title: 'Notification',
          deviceId: process.env.PUSHSAFER_DEVICE_ID,
        });

        await NotificationService.sendEmail({
          to: process.env.EMAIL_RECEIVER,
          from: process.env.EMAIL_SENDER,
          subject: '[HOMEPILOT] NOTIFICATION',
          text: 'High temperature or humidity detected!',
          device_name: device.name,
          temperature,
        });

        this.lastNotificationTime = currentTime;
      }
      console.log('Alert! Temperature or humidity is too high');
      deviceData.alertStatus = true;
    }

    // Save historical data
    const historicalData = {
      temperature,
      humidity,
      light: deviceData.light || 0,
      alertStatus: deviceData.alertStatus ? 'Danger' : 'Normal',
    };
    await device.saveHistoricalData(historicalData);
  }
}

export default MqttService;
