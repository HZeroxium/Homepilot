#include "MQTTManager.h"

MQTTManager *MQTTManager::instance = nullptr;

/**
 * @brief Initializes the MQTT client and connects to the MQTT broker.
 */
void MQTTManager::init(WiFiClient &client, IntrusionSystem *system)
{
  this->system = system;

  mqttClient.setClient(client);
  mqttClient.setServer(mqtt_server, 1883);

  mqttClient.setCallback(staticCallback); // Set static callback
  MQTTManager::instance = this;           // Assign current instance to static pointer

  while (!mqttClient.connected())
  {
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (mqttClient.connect(clientId.c_str()))
    {
      Serial.println("Connected to MQTT!");
      mqttClient.subscribe(command_topic);
      Serial.println("Subscribed to " + String(command_topic));
    }
    else
    {
      delay(5000);
    }
  }
}

void MQTTManager::loop()
{
  mqttClient.loop();
  // send every 10 seconds
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 5000)
  {
    lastSend = millis();
    publishData("direct", "hello");
  }
}

/**
 * @brief Static callback function delegating to the instance.
 */
void MQTTManager::staticCallback(char *topic, byte *payload, unsigned int length)
{
  Serial.println("Static callback triggered");
  if (MQTTManager::instance)
  {
    MQTTManager::instance->handleCallback(topic, payload, length);
  }
}

/**
 * @brief Instance method to handle incoming MQTT messages.
 */
void MQTTManager::handleCallback(char *topic, byte *payload, unsigned int length)
{
  char message[length + 1];
  strncpy(message, (char *)payload, length);
  message[length] = '\0';

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error)
  {
    Serial.print("JSON Parsing Error: ");
    Serial.println(error.f_str());
    return;
  }

  String action = doc["action"];
  String params = doc["parameters"] | "";
  Serial.println("Received MQTT Command: " + action + " with parameters: " + params);

  processCommand(action, params);
}

/**
 * @brief Processes MQTT commands.
 */
void MQTTManager::processCommand(const String &action, const String &params)
{
  if (action == "activate_Intrusion")
  {
    system->activate();
    publishData("remote", "activated");
  }
  else if (action == "deactivate_Intrusion")
  {
    system->deactivate();
    publishData("remote", "deactivated");
  }
}

/**
 * @brief Publishes a data message to the MQTT broker.
 *
 * This function serializes a JSON document containing the method and status
 * strings, and publishes it to the data topic.
 *
 * @param[in] method The method to unlock the door ("direct", "fingerprint", "remote").
 * @param[in] status The status to publish as a string. ("grant", "deny", "error").
 */
void MQTTManager::publishData(const char *method, const char *status)
{
  Serial.println("Publishing data to MQTT");
  JsonDocument doc;
  JsonObject data = doc["data"].to<JsonObject>();
  data["method"] = method;
  data["status"] = status;
  data["alertStatus"] = system->isAlarm();
  data["motion"] = system->readMotion();
  data["distance"] = system->readDistance();


  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);

  mqttClient.publish(data_topic, jsonBuffer);
}