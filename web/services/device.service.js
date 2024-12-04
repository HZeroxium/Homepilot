// services/deviceService.js

import Device from '../models/device.model.js';
import mqttClient from '../config/mqttConfig.js';
import Lock from '../models/lock.model.js';
import Intrusion from '../models/intrusion.model.js';

class DeviceService {
  static async getDeviceByType(userId, deviceType) {
    return await Device.getDeviceByType(userId, deviceType);
  }

  static async getDeviceById(deviceId) {
    return await Device.getDeviceById(deviceId);
  }

  static async createDevice(userId, type, name) {
    const device = await Device.create(userId, type, name);
    // await device.logActivity('added', userId);
    return device;
  }

  static async updateDeviceInfo(device, { name, type }) {
    await device.updateDeviceInfo({ name, type });
  }

  static async deleteDevice(device) {
    await device.delete();
  }

  static async getHistoricalData(device, limit = 20) {
    return await device.getHistoricalData(limit);
  }

  static async updateDeviceStatus(device, status) {
    await device.updateStatus(status);
  }

  static async updateDevicePassword(deviceData, newPassword) {
    // Create a Lock instance using the device data
    const lock = new Lock(
      deviceData.uid,
      deviceData.userId,
      deviceData.type,
      deviceData.name,
      deviceData.status,
      deviceData.data
    );

    // Call the updatePassword method
    await lock.updatePassword(newPassword);
  }

  static async updateDeviceDistance(device, distance) {
    const intrusion = new Intrusion(
      device.uid,
      device.userId,
      device.type,
      device.name,
      device.status,
      device.data
    );

    await intrusion.updateDistance(distance);
  }

  static async publishToDevice(userId, device, action, parameters = {}) {
    const topic = `home/${userId}/${device.type}/${device.uid}/command`;
    const message = JSON.stringify({
      deviceId: device.uid,
      action,
      parameters,
    });

    return new Promise((resolve, reject) => {
      mqttClient.publish(topic, message, { qos: 1 }, (err) => {
        if (err) {
          console.error('Error publishing to MQTT:', err);
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  static async getSensorData(userId) {
    const devices = await Device.getDevicesByUserId(userId);
    if (!devices || devices.length === 0) {
      console.log('No devices found for this user.');
      return [];
    }

    const temperatureDevices = devices.filter((d) => d.type === 'fire_smoke');
    const intrusionDevices = devices.filter((d) => d.type === 'intrusion');
    const accessDevices = devices.filter((d) => d.type === 'access_control');

    const fireSmokeData = await Promise.all(
      temperatureDevices.map(async (device) => {
        const historicalData = await device.getHistoricalData(1);
        return {
          device: device.uid,
          name: device.name,
          type: device.type,
          temperature: historicalData[0]?.temperature || null,
          humidity: historicalData[0]?.humidity || null,
          timestamp: historicalData[0]?.timestamp || null,
        };
      })
    );

    const intrusionData = await Promise.all(
      intrusionDevices.map(async (device) => {
        const historicalData = await device.getHistoricalData(1);
        return {
          device: device.uid,
          name: device.name,
          type: device.type,
          distance: historicalData[0]?.distance || null,
          motion: historicalData[0]?.motion || null,
          timestamp: historicalData[0]?.timestamp || null,
        };
      })
    );

    const accessData = await Promise.all(
      accessDevices.map(async (device) => {
        const historicalData = await device.getHistoricalData(1);
        return {
          device: device.uid,
          name: device.name,
          type: device.type,
          status: historicalData[0]?.status || null,
          timestamp: historicalData[0]?.timestamp || null,
        };
      })
    );

    return [...fireSmokeData, ...intrusionData, ...accessData];
  }
}

export default DeviceService;
