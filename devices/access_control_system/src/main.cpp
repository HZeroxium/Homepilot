// main.cpp
#include <Arduino.h>
#include "WifiManager.h"
#include "MQTTManager.h"
#include "KeypadManager.h"
#include "DisplayManager.h"
#include "ServoManager.h"
#include "NeoPixelManager.h"

#define POT_PIN 34

// Global objects
KeypadManager keypadManager;
DisplayManager displayManager;
ServoManager servoManager;
NeoPixelManager neoPixelManager;
WiFiManager wifiManager;
MQTTManager mqttManager;

void setup()
{
  Serial.begin(115200);

  // Initialize components
  displayManager.init();
  displayManager.showMessage("System Booting...");

  neoPixelManager.init();
  neoPixelManager.setReady(100);

  servoManager.init();

  keypadManager.init(&displayManager);

  wifiManager.connect();
  mqttManager.init(wifiManager.getClient(), &servoManager, &displayManager, &neoPixelManager);

  neoPixelManager.setWaiting(50);

  displayManager.showMenu();
}

void loop()
{
  keypadManager.handleKeypadInput(&servoManager, &neoPixelManager, &mqttManager);
  mqttManager.loop();

  // Handle Potentiometer (Fingerprint simulation)
  int potVal = analogRead(POT_PIN);
  if (potVal > 2000)
  {
    servoManager.grantAccess(&neoPixelManager, &displayManager);
    delay(2000);
    displayManager.showMenu();
  }

  delay(10);
}
