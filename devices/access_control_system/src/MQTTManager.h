// MQTTManager.h
#ifndef MQTTMANAGER_H
#define MQTTMANAGER_H

#include <PubSubClient.h>
#include "ServoManager.h"
#include "DisplayManager.h"
#include "NeoPixelManager.h"
#include <WiFi.h>
#include <ArduinoJson.h>

class MQTTManager
{
public:
  void init(WiFiClient &client, ServoManager *servoManager, DisplayManager *displayManager, NeoPixelManager *neoPixelManager);
  void loop();
  void processCommand(const String &action, const String &params);
  void publishData(const char *method, const char *status);

  static MQTTManager *instance; // Static instance for global access

private:
  PubSubClient mqttClient;
  ServoManager *servoManager;
  DisplayManager *displayManager;
  NeoPixelManager *neoPixelManager;
  const char *data_topic = "home/0765b6c9-3475-4575-840f-f559c2bd7cf8/access_control/TTMyGZ6wF5kVOoJx0Jqr/data";
  const char *command_topic = "home/0765b6c9-3475-4575-840f-f559c2bd7cf8/access_control/TTMyGZ6wF5kVOoJx0Jqr/command";
  const char *mqtt_server = "test.mosquitto.org";

  static void staticCallback(char *topic, byte *payload, unsigned int length); // Static callback
  void handleCallback(char *topic, byte *payload, unsigned int length);        // Instance method
};

#endif
