#ifndef MQTTMANAGER_H
#define MQTTMANAGER_H

#include <PubSubClient.h>
#include "IntrusionSystem.h"
#include <WiFi.h>
#include <ArduinoJson.h>

class MQTTManager
{
public:
  void init(WiFiClient &client, IntrusionSystem *system);
  void loop();
  void processCommand(const String &action, const String &params);
  void publishData(const char *method, const char *status);

  static MQTTManager *instance; // Static instance for global access

private:
  PubSubClient mqttClient;
  IntrusionSystem *system;
  const char *data_topic = "home/0765b6c9-3475-4575-840f-f559c2bd7cf8/intrusion/fgkBOaZZN3NXhmfbn01p/data";
  const char *command_topic = "home/0765b6c9-3475-4575-840f-f559c2bd7cf8/intrusion/fgkBOaZZN3NXhmfbn01p/command";
  const char *mqtt_server = "test.mosquitto.org";

  static void staticCallback(char *topic, byte *payload, unsigned int length); // Static callback
  void handleCallback(char *topic, byte *payload, unsigned int length);        // Instance method
};

#endif
