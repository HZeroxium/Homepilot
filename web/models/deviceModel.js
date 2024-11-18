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
  /**
   * Creates a new device and saves it to Firestore.
   * @param {string} userId - The ID of the user who owns the device.
   * @param {string} type - The type of the device (e.g., "fire_smoke", "door").
   * @param {string} name - The name of the device.
   * @returns {Promise<Device>} - Resolves to the newly created Device object.
   * @throws Will throw an error if there's an issue during device creation.
   */
  static async createDevice(userId, type, name) {
    try {
      // Generate a new unique ID for the device
      const uid = devicesCollection.doc().id;

      // Instantiate a new Device object with the provided details
      const device = new Device(uid, userId, type, name, "offline", {});

      // Save the device to Firestore
      await device.save();

      // Return the created Device object
      return device;
    } catch (error) {
      // Log the error if device creation fails
      console.error("Error creating device:", error);
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
      console.error("Error updating device info:", error);
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
      console.error("Error deleting device:", error);
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
        .collection("historicalData");
      await historyRef.add({
        ...dataPoint,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error saving historical data:", error);
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
        .collection("historicalData");

      // Query the subcollection, ordering by timestamp and limiting the number of results
      const snapshot = await historyRef
        .orderBy("timestamp", "desc")
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
      console.error("Error getting historical data:", error);
      throw error;
    }
  }

  /**
   * Updates the device's password.
   * @param {string} newPassword - The new plain text password to store.
   * @returns {Promise<void>} - Resolves when the password is updated.
   * @throws Will throw an error if there's an issue updating the password.
   */
  async updatePassword(newPassword) {
    try {
      // Update the stored password in the device document
      this.data.password = newPassword;
      // Update the password in the Firestore document
      await devicesCollection
        .doc(this.uid)
        .update({ "data.password": newPassword });
    } catch (error) {
      // Log the error if password update fails
      console.error("Error updating device password:", error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Compares the provided password with the stored device password.
   * Utilizes bcrypt to securely compare the password against the stored hash.
   * @param {string} inputPassword - The plain text password to compare.
   * @returns {Promise<boolean>} - Resolves to true if the password matches, false otherwise.
   * @throws Will throw an error if there's an issue during comparison.
   */
  async comparePassword(inputPassword) {
    try {
      // Compare the input password with the stored hashed password
      return await bcrypt.compare(inputPassword, this.data.password);
    } catch (error) {
      // Log the error if password comparison fails
      console.error("Error comparing device password:", error);
      // Propagate the error further
      throw error;
    }
  }
}

export default Device;
