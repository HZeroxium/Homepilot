// services/dashboard.service.js

import Device from '../models/device.model.js';

class DashboardService {
  /**
   * Get all devices associated with a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array>} - Returns an array of devices.
   */
  static async getUserDevices(userId) {
    try {
      return await Device.getDevicesByUserId(userId);
    } catch (error) {
      console.error('Error fetching devices for user:', error);
      throw new Error('Unable to fetch devices. Please try again later.');
    }
  }
}

export default DashboardService;
