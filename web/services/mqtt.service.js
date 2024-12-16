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

    // Handle intrusion devices
    if (device.type === 'intrusion') {
      await this.handleIntrusionDevice(device, deviceData, userId);
    }

    // Handle access_control devices
    if (device.type === 'access_control') {
      await this.handleAccessControlDevice(device, deviceData, userId);
    }

    return { device, deviceType, deviceData, userId };
  }

  static async checkAnomaly() {
    try {
      // Create a timestamp in the format: "December 7, 2024 at 7:45:12 AM UTC+7"
      const timestamp = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timeZone: 'Asia/Bangkok', // Set timezone to UTC+7
      }).format(new Date());

      const formattedTimestamp = timestamp.replace('GMT', 'UTC');

      console.log('Checking anomaly for timestamp:', timestamp);

      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp: formattedTimestamp }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const { prediction } = data;

      return prediction === 'anomaly';
    } catch (error) {
      console.error('Error checking anomaly:', error);
      return false; // If the request fails, return false for anomaly status.
    }
  }

  static async handleAccessControlDevice(device, deviceData, userId) {
    console.log('Access control device data:', deviceData);
    const { method = '', status = '' } = deviceData;

    // check if status is granted, send notification

    const isAnomaly = await this.checkAnomaly();

    if (status === 'granted' && isAnomaly) {
      await NotificationService.sendDevicesNotification({
        message: 'Alert! Anomaly detected',
        title: 'Notification',
        deviceId: process.env.PUSHSAFER_DEVICE_ID,
      });

      await NotificationService.sendEmail({
        to: process.env.EMAIL_RECEIVER,
        from: process.env.EMAIL_SENDER,
        subject: '[HOMEPILOT] NOTIFICATION',
        text: 'Anomaly detected!',
        device_name: device.name,
      });
      console.log('Alert! Anomaly detected');
    }

    // save historical data
    const historicalData = {
      method,
      status,
    };
    await device.saveHistoricalData(historicalData);
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

  static async handleIntrusionDevice(device, deviceData, userId) {
    const { distance = 0, motion = false } = deviceData;

    const safeDistance = 20;

    // Check for motion and send notifications
    if (motion && distance <= safeDistance) {
      await NotificationService.sendDevicesNotification({
        message: 'Alert! Motion detected',
        title: 'Notification',
        deviceId: process.env.PUSHSAFER_DEVICE_ID,
      });

      await NotificationService.sendEmail({
        to: process.env.EMAIL_RECEIVER,
        from: process.env.EMAIL_SENDER,
        subject: '[HOMEPILOT] NOTIFICATION',
        text: 'Motion detected!',
        device_name: device.name,
      });
      console.log('Alert! Motion detected');
      deviceData.alertStatus = true;
    }

    // Save historical data
    const historicalData = {
      distance,
      motion,
      alertStatus: deviceData.alertStatus ? 'Danger' : 'Normal',
    };
    await device.saveHistoricalData(historicalData);
  }
}

export default MqttService;
