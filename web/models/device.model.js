// deviceModel.js

import { db } from '../config/firebaseConfig.js';
import bcrypt from 'bcrypt';

const devicesCollection = db.collection('devices');

class Device {
  constructor(uid, userId, type, name, status = 'offline', data = {}) {
    this.uid = uid;
    this.userId = userId;
    this.type = type;
    this.name = name;
    this.status = status;
    this.data = data;
  }

  async save() {
    try {
      await devicesCollection.doc(this.uid).set({
        userId: this.userId,
        type: this.type,
        name: this.name,
        status: this.status,
        data: this.data,
      });
      return true;
    } catch (error) {
      console.error('Error saving device:', error);
      throw error;
    }
  }

  static async getDeviceById(uid) {
    try {
      const doc = await devicesCollection.doc(uid).get();
      if (!doc.exists) return null;

      const data = doc.data();
      return new Device(
        doc.id,
        data.userId,
        data.type,
        data.name,
        data.status,
        data.data
      );
    } catch (error) {
      console.error('Error getting device by ID:', error);
      throw error;
    }
  }

  static async getDeviceByType(userId, type) {
    try {
      // Fetch the device using Firestore query
      const querySnapshot = await devicesCollection
        .where('userId', '==', userId)
        .where('type', '==', type)
        .limit(1)
        .get();

      // Check if the device exists
      if (querySnapshot.empty) {
        return null; // Return null if the device does not exist
      }

      // Retrieve the data from the document
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      // Return a new Device instance constructed with the document data
      return new Device(
        doc.id, // Device ID
        data.userId, // User ID associated with the device
        data.type, // Type of the device
        data.name, // Name of the device
        data.status, // Status of the device
        data.data // Additional data associated with the device
      );
    } catch (error) {
      // Log the error if there's an issue fetching the device
      console.error('Error getting device by type:', error);
      // Propagate the error further
      throw error;
    }
  }

  static async getDevicesByUserId(userId) {
    try {
      const devices = [];
      const querySnapshot = await devicesCollection
        .where('userId', '==', userId)
        .get();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        devices.push(
          new Device(
            doc.id,
            data.userId,
            data.type,
            data.name,
            data.status,
            data.data
          )
        );
      });

      return devices;
    } catch (error) {
      console.error('Error getting devices by user ID:', error);
      throw error;
    }
  }

  async updateData(newData) {
    try {
      this.data = { ...this.data, ...newData };
      await devicesCollection.doc(this.uid).update({ data: this.data });
    } catch (error) {
      console.error('Error updating device data:', error);
      throw error;
    }
  }

  async updateStatus(status) {
    try {
      await this.updateData({ status });
    } catch (error) {
      // Log the error if there's an issue updating the status
      console.error('Error updating device status:', error);
      // Propagate the error further
      throw error;
    }
  }

  static async create(userId, type, name) {
    try {
      // Generate a new unique ID for the device
      const uid = devicesCollection.doc().id;

      // Instantiate a new Device object with the provided details
      const device = new Device(uid, userId, type, name, 'offline', {});

      // Save the device to Firestore
      await device.save();

      // Return the created Device object
      return device;
    } catch (error) {
      // Log the error if device creation fails
      console.error('Error creating device:', error);
      // Propagate the error further
      throw error;
    }
  }
  /**
   * Updates the device's information (name and/or type).
   * @param {object} deviceInfo - Object containing the new name and/or type.
   * @param {string} deviceInfo.name - New name of the device.
   * @param {string} deviceInfo.type - New type of the device.
   * @returns {Promise<boolean>} - Resolves to true if the device info is updated successfully.
   * @throws Will throw an error if there's an issue during updating the device info.
   */
  async updateDeviceInfo({ name, type }) {
    try {
      // Update the device's name and/or type
      if (name) this.name = name;
      if (type) this.type = type;

      // Update the device document in Firestore
      await devicesCollection.doc(this.uid).update({
        name: this.name,
        type: this.type,
      });

      // Return true if the device info is updated successfully
      return true;
    } catch (error) {
      // Log an error message if there's an issue updating the device info
      console.error('Error updating device info:', error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Deletes the device and its associated data.
   *
   * Removes the device document from Firestore, and optionally deletes
   * related subcollections such as activity logs.
   *
   * @returns {Promise<boolean>} - Resolves to true if the device is deleted successfully.
   * @throws Will throw an error if there's an issue during deletion.
   */
  async delete() {
    try {
      // Delete the device document from Firestore
      await devicesCollection.doc(this.uid).delete();

      // Optionally, delete related subcollections (e.g., activityLogs)
      // const activityLogs = await devicesCollection.doc(this.uid).collection('activityLogs').listDocuments();
      // const deletePromises = activityLogs.map(doc => doc.delete());
      // await Promise.all(deletePromises);

      // Return true if the device is deleted successfully
      return true;
    } catch (error) {
      // Log an error message if there's an issue deleting the device
      console.error('Error deleting device:', error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Saves a new historical data point for the device.
   *
   * Creates a new document in the device's "historicalData" subcollection in
   * Firestore, containing the provided data point and a timestamp.
   *
   * @param {Object} dataPoint - The historical data point to save (e.g., {temp: 22.5, humidity: 55}).
   * @returns {Promise<void>} - Resolves when the data point is saved.
   * @throws Will throw an error if there's an issue saving the data.
   */
  async saveHistoricalData(dataPoint) {
    try {
      const historyRef = devicesCollection
        .doc(this.uid)
        .collection('historicalData');
      await historyRef.add({
        ...dataPoint,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error saving historical data:', error);
      throw error;
    }
  }
  /**
   * Retrieves historical data for the device.
   *
   * Fetches a limited number of historical data entries from the device's
   * historical data collection in Firestore, ordered by timestamp.
   *
   * @param {number} limit - The maximum number of historical data entries to retrieve.
   * @returns {Promise<Array<Object>>} - Resolves to an array of historical data objects.
   * @throws Will throw an error if there's an issue retrieving the data.
   */
  async getHistoricalData(limit = 100) {
    try {
      // Reference to the historical data subcollection of this device
      const historyRef = devicesCollection
        .doc(this.uid)
        .collection('historicalData');

      // Query the subcollection, ordering by timestamp and limiting the number of results
      const snapshot = await historyRef
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      // Collect the data from the query snapshot
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      // Return the collected data in chronological order
      return data.reverse();
    } catch (error) {
      // Log the error and rethrow it for further handling
      console.error('Error getting historical data:', error);
      throw error;
    }
  }

  async updateDistance(distance) {
    try {
      this.data.distance = distance;
      await devicesCollection
        .doc(this.uid)
        .update({ 'data.distance': distance });
    } catch (error) {
      console.error('Error updating device distance:', error);
      throw error;
    }
  }
}

export default Device;
