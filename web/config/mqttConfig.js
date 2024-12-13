// config/mqttConfig.js

import mqtt from 'mqtt';

const initializeMqttClient = () => {
  const mqttOptions = {
    clientId: `web_client_${Math.random().toString(16).substr(2, 8)}`,
    clean: true,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME || '',
    password: process.env.MQTT_PASSWORD || '',
    reconnectPeriod: 1000, // Retry every second if connection is lost
  };

  const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, mqttOptions);

  mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    const topic = 'home/+/+/+/data'; // Wildcard topic for IoT devices
    mqttClient.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err.message);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });
  });

  mqttClient.on('error', (error) => {
    console.error('MQTT connection error:', error.message);
  });

  mqttClient.on('message', (topic, message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log(`Received message on ${topic}:`, parsedMessage);
    } catch (error) {
      console.error('Failed to parse MQTT message:', error.message);
    }
  });

  mqttClient.on('reconnect', () => {
    console.warn('Reconnecting to MQTT broker...');
  });

  mqttClient.on('close', () => {
    console.warn('MQTT connection closed');
  });

  return mqttClient;
};

const mqttClient = initializeMqttClient();

export default mqttClient;
