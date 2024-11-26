// controllers/mqtt.controller.js

import mqttClient from '../config/mqttConfig.js';
import MqttService from '../services/mqtt.service.js';

const mqttController = (io) => {
  mqttClient.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      const result = await MqttService.handleDeviceData({ topic, payload });

      if (result) {
        const { deviceId, deviceType, deviceData, userId } = result;

        // Emit data update to user's WebSocket room
        io.to(userId).emit('deviceDataUpdate', {
          deviceId,
          deviceType,
          data: deviceData,
        });
        console.log(`Emitted deviceDataUpdate for device ${deviceId}`);
      }
    } catch (error) {
      console.error('Error handling MQTT message:', error);
    }
  });
};

export default mqttController;
