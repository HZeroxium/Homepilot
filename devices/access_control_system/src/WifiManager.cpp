// WifiManager.cpp
#include "WifiManager.h"

/**
 * @brief Connects to the WiFi network.
 *
 * This function prints a message to the serial console, and then begins
 * connecting to the WiFi network. It then waits until the connection is
 * established, and prints a message to the console with the IP address of
 * the ESP32.
 */
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
