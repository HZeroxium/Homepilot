// WifiManager.h
#ifndef WIFIMANAGER_H
#define WIFIMANAGER_H

#include <WiFi.h>

class WiFiManager
{
public:
  void connect();
  WiFiClient &getClient();

private:
  const char *ssid = "Wokwi-GUEST";
  const char *password = "";
  WiFiClient wifiClient;
};

#endif
