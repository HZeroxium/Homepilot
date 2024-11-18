// deviceModel.js

import { db } from "../config/firebaseConfig.js";
import bcrypt from "bcrypt";

const devicesCollection = db.collection("devices");

class Device {
  /**
   * Device class represents a device in the database.
   * @constructor
   * @param {string} uid - Unique ID of the device.
   * @param {string} userId - ID of the user who owns the device.
   * @param {string} type - Type of the device (e.g. "fire_smoke", "door", etc.).
   * @param {string} name - Name of the device.
   * @param {string} status - Status of the device (e.g. "online", "offline", etc.).
   * @param {Object} data - Additional data associated with the device.
   */
  constructor(uid, userId, type, name, status, data) {
    /**
     * Unique ID of the device.
     * @type {string}
     */
    this.uid = uid;

    /**
     * ID of the user who owns the device.
     * @type {string}
     */
    this.userId = userId;

    /**
     * Type of the device (e.g. "fire_smoke", "door", etc.).
     * @type {string}
     */
    this.type = type;

    /**
     * Name of the device.
     * @type {string}
     */
    this.name = name;

    /**
     * Status of the device (e.g. "online", "offline", etc.).
     * @type {string}
     */
    this.status = status || "offline";

    /**
     * Additional data associated with the device.
     * @type {Object}
     */
    this.data = data || {};
  }

  /**
   * Save device to Firestore.
   * @returns {Promise<boolean>} - True if the device is saved successfully, false otherwise.
   */
  async save() {
    try {
      // Save device to Firestore
      await devicesCollection.doc(this.uid).set({
        userId: this.userId,
        type: this.type,
        name: this.name,
        status: this.status,
        data: this.data,
      });
      // Return true if the device is saved successfully
      return true;
    } catch (error) {
      // Log error if the device is not saved successfully
      console.error("Error saving device:", error);
      // Throw the error
      throw error;
    }
  }

  /**
   * Get device by unique ID.
   * @param {string} uid - Device ID.
   * @returns {Promise<Device|null>} - Returns a Device object if found, otherwise null.
   */
  static async getDeviceById(uid) {
    try {
      // Fetch the document from Firestore using the device ID
      const doc = await devicesCollection.doc(uid).get();

      // Check if the document exists
      if (!doc.exists) {
        return null; // Return null if the device does not exist
      }

      // Retrieve the data from the document
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
      console.error("Error getting device by ID:", error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Get device by type and user ID.
   *
   * Fetches a single device from Firestore using the user's ID and device type.
   * @param {string} userId - User's ID.
   * @param {string} type - Device type.
   * @returns {Promise<Device|null>} - Returns a Device object if found, otherwise null.
   */
  static async getDeviceByType(userId, type) {
    try {
      // Fetch the device using Firestore query
      const querySnapshot = await devicesCollection
        .where("userId", "==", userId)
        .where("type", "==", type)
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
      console.error("Error getting device by type:", error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Get all devices by user ID.
   * @param {string} userId - User's ID.
   * @returns {Promise<Device[]>} - Returns an array of Device objects associated with the user.
   */
  static async getDevicesByUserId(userId) {
    try {
      const devices = [];
      const querySnapshot = await devicesCollection
        .where("userId", "==", userId)
        .get();

      // Iterate over the query results and extract the data
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Create a new Device instance using the data from the document
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

      // Return the array of Device objects
      return devices;
    } catch (error) {
      console.error("Error getting devices by user ID:", error);
      throw error;
    }
  }

  /**
   * Updates the device status.
   * @param {string} status - New status of the device.
   * @returns {Promise<void>} - Resolves when the status is updated.
   */
  async updateStatus(status) {
    try {
      // Update the device status
      this.status = status;

      // Update the device document in Firestore
      await devicesCollection.doc(this.uid).update({ status });

      // Resolve when the status is updated
      return;
    } catch (error) {
      // Log the error if there's an issue updating the status
      console.error("Error updating device status:", error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Updates the device data.
   *
   * Merges the provided data with the existing data and updates the
   * device document in Firestore.
   * @param {object} data - New data.
   * @returns {Promise<void>} - Resolves when the data is updated.
   */
  async updateData(data) {
    try {
      // Merge the new data with the existing data
      this.data = { ...this.data, ...data };

      // Update the device document in Firestore
      await devicesCollection.doc(this.uid).update({ data: this.data });

      // Resolve when the data is updated
      return;
    } catch (error) {
      // Log the error if there's an issue updating the data
      console.error("Error updating device data:", error);
      // Propagate the error further
      throw error;
    }
  }

  // Additional methods omitted for brevity. Implement similarly.
}

export default Device;
