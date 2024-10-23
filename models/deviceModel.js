// models/deviceModel.js

const { db } = require("../config/firebaseConfig");

const devicesCollection = db.collection("devices");

class Device {
  constructor(uid, userId, type, name, status, data) {
    this.uid = uid; // Unique device ID
    this.userId = userId; // Owner's user ID
    this.type = type; // Device type (e.g., 'intrusion', 'fire_smoke', 'access_control')
    this.name = name; // Device name
    this.status = status || "offline"; // Current status
    this.data = data || {}; // Additional data (e.g., sensor readings)
  }

  // Lưu thiết bị vào Firestore
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
      console.error("Error saving device:", error);
      throw error;
    }
  }

  // Lấy thiết bị theo UID
  static async getDeviceById(uid) {
    try {
      const doc = await devicesCollection.doc(uid).get();
      if (!doc.exists) {
        return null;
      }
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
      console.error("Error getting device by ID:", error);
      throw error;
    }
  }

  // Lấy thiết bị theo loại và người dùng
  static async getDeviceByType(userId, type) {
    try {
      const querySnapshot = await devicesCollection
        .where("userId", "==", userId)
        .where("type", "==", type)
        .limit(1)
        .get();
      if (querySnapshot.empty) {
        return null;
      }
      const doc = querySnapshot.docs[0];
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
      console.error("Error getting device by type:", error);
      throw error;
    }
  }

  // Lấy tất cả thiết bị của người dùng
  static async getDevicesByUserId(userId) {
    try {
      const devices = [];
      const querySnapshot = await devicesCollection
        .where("userId", "==", userId)
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
      console.error("Error getting devices by user ID:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái thiết bị
  async updateStatus(status) {
    try {
      this.status = status;
      await devicesCollection.doc(this.uid).update({ status });
    } catch (error) {
      console.error("Error updating device status:", error);
      throw error;
    }
  }

  // Cập nhật dữ liệu thiết bị
  async updateData(data) {
    try {
      this.data = { ...this.data, ...data };
      await devicesCollection.doc(this.uid).update({ data: this.data });
    } catch (error) {
      console.error("Error updating device data:", error);
      throw error;
    }
  }

  // Lưu lịch sử hoạt động
  async logActivity(action, userId) {
    try {
      const activityLogRef = devicesCollection
        .doc(this.uid)
        .collection("activityLogs");
      await activityLogRef.add({
        action,
        userId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error logging activity:", error);
      throw error;
    }
  }

  // Tạo và lưu thiết bị mới
  static async createDevice(userId, type, name) {
    try {
      const uid = devicesCollection.doc().id; // Tạo UID mới
      const device = new Device(uid, userId, type, name, "offline", {});
      await device.save();
      return device;
    } catch (error) {
      console.error("Error creating device:", error);
      throw error;
    }
  }

  // Update device information
  async updateDeviceInfo({ name, type }) {
    try {
      if (name) this.name = name;
      if (type) this.type = type;
      await devicesCollection.doc(this.uid).update({
        name: this.name,
        type: this.type,
      });
      return true;
    } catch (error) {
      console.error("Error updating device info:", error);
      throw error;
    }
  }

  // Delete device
  async delete() {
    try {
      await devicesCollection.doc(this.uid).delete();
      // Optionally, delete related subcollections (e.g., activityLogs)
      // const activityLogs = await devicesCollection.doc(this.uid).collection('activityLogs').listDocuments();
      // const deletePromises = activityLogs.map(doc => doc.delete());
      // await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  }

  // Lưu dữ liệu lịch sử
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

  // Lấy dữ liệu lịch sử
  async getHistoricalData(limit = 100) {
    try {
      const historyRef = devicesCollection
        .doc(this.uid)
        .collection("historicalData");
      const snapshot = await historyRef
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get();
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data.reverse(); // Đảo ngược để có thứ tự tăng dần theo thời gian
    } catch (error) {
      console.error("Error getting historical data:", error);
      throw error;
    }
  }
}

module.exports = Device;
