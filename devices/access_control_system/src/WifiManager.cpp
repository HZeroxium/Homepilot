// WifiManager.cpp
#include "WifiManager.h"

void WiFiManager::connect()
{
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

WiFiClient &WiFiManager::getClient()
{
  return wifiClient;
}
