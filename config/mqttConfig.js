// config/mqttConfig.js
const mqtt = require("mqtt");
const appConfig = require("./appConfig");

const mqttOptions = {
  clientId: `web_client_${Math.random().toString(16).substr(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USERNAME || "",
  password: process.env.MQTT_PASSWORD || "",
  reconnectPeriod: 1000,
};

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, mqttOptions);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to all device data topics using wildcard
  mqttClient.subscribe("home/+/+/+/data", { qos: 1 }, (err) => {
    if (err) {
      console.error("Failed to subscribe to data topics:", err);
    } else {
      console.log("Subscribed to all device data topics: home/+/+/+/data");
    }
  });
});

mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

module.exports = mqttClient;
