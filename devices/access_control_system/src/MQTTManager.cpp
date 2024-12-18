// MQTTManager.cpp
#include "MQTTManager.h"

MQTTManager *MQTTManager::instance = nullptr;

/**
 * @brief Initializes the MQTT client and connects to the MQTT broker.
 */
void MQTTManager::init(WiFiClient &client, ServoManager *servo, DisplayManager *display, NeoPixelManager *neoPixel)
{
  this->servoManager = servo;
  this->displayManager = display;
  this->neoPixelManager = neoPixel;

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
  Serial.println("Received message: " + String(message));
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error)
  {
    Serial.print("JSON Parsing Error: ");
    Serial.println(error.f_str());
    return;
  }

  String action = doc["action"];
  String newPassword = "";

  // Trích xuất giá trị của newPassword từ parameters nếu có
  if (doc["parameters"].containsKey("newPassword"))
  {
    newPassword = doc["parameters"]["newPassword"].as<String>();
  }

  Serial.println("Received MQTT Command: " + action + " with newPassword: " + newPassword);

  processCommand(action, newPassword);
}

/**
 * @brief Processes MQTT commands.
 */
void MQTTManager::processCommand(const String &action, const String &params)
{
  if (action == "unlock")
  {
    servoManager->grantAccess(neoPixelManager, displayManager);
    displayManager->clearScreen();
    delay(2000);
    displayManager->showMenu();
    publishData("remote", "grant");
  }
  else if (action == "lock")
  {
    displayManager->showMessage("Locking...");
    servoManager->init();
    neoPixelManager->setReady();
    // publishData("Door Locked");
  }
  else if (action == "update_pin")
  {
    displayManager->clearScreen();
    displayManager->showMessage("PIN Updated");
    delay(2000);
    displayManager->showMenu();
    servoManager->setValidPIN(params);
    Serial.println("New PIN: " + servoManager->getValidPIN());
    // publishData("PIN Updated");
  }
}

void MQTTManager::publishData(const char *method, const char *status)
{
  JsonDocument doc;
  Serial.println(method);
  Serial.println(status);
  doc["data"].to<JsonObject>()["method"] = method;
  doc["status"] = status;

  Serial.println("Publishing data to " + String(data_topic));
  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);

  mqttClient.publish(data_topic, jsonBuffer);
}
