#ifndef MQTTMANAGER_H
#define MQTTMANAGER_H

#include <PubSubClient.h>
#include "FireAlarmSystem.h"
#include <WiFi.h>
#include <ArduinoJson.h>

class MQTTManager
{
public:
  void init(WiFiClient &client, FireAlarmSystem *system);
  void loop();
  void processCommand(const String &action, const String &params);
  void publishData(const char *method, const char *status);

  static MQTTManager *instance; // Static instance for global access

private:
  PubSubClient mqttClient;
  FireAlarmSystem *system;
  const char *data_topic = "home/522e979d-a624-45a1-919f-34e0963cad31/fire_smoke/UN64v5ieE5FFiAmoadcm/data";
  const char *command_topic = "home/522e979d-a624-45a1-919f-34e0963cad31/fire_smoke/UN64v5ieE5FFiAmoadcm/command";
  const char *mqtt_server = "test.mosquitto.org";

  static void staticCallback(char *topic, byte *payload, unsigned int length); // Static callback
  void handleCallback(char *topic, byte *payload, unsigned int length);        // Instance method
};

#endif
