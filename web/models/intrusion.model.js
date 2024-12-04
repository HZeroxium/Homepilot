import Device from '../models/device.model.js';

class Intrusion extends Device {
  constructor(uid, userId, type, name, status = 'offline', data = {}) {
    super(uid, userId, type, name, status, data);
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

export default Intrusion;
