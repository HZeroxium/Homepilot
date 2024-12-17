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

/**
 * @brief The setup function runs once at the beginning of the program.
 *
 * This function performs the following actions:
 * 1. Initializes the serial monitor.
 * 2. Initializes the DisplayManager and shows a message.
 * 3. Initializes the NeoPixelManager and sets the color to ready.
 * 4. Initializes the ServoManager.
 * 5. Initializes the KeypadManager with the DisplayManager.
 * 6. Initializes the WifiManager and connects to the network.
 * 7. Initializes the MQTTManager with the WifiManager, ServoManager,
 *    DisplayManager, and NeoPixelManager.
 * 8. Shows a message on the LCD asking the user to enter a PIN.
 */
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

/**
 * @brief The main loop of the program.
 *
 * This function will be called repeatedly, and performs the following actions:
 * 1. Checks for keypad input and processes it.
 * 2. Checks for MQTT messages and processes them.
 * 3. Checks the potentiometer for a high value, which simulates a fingerprint
 *    scan, and grants access to the door if it is high.
 */

void loop()
{
  keypadManager.handleKeypadInput(&servoManager, &neoPixelManager, &mqttManager);
  mqttManager.loop();

  // Handle Potentiometer (Fingerprint simulation)
  // int potVal = analogRead(POT_PIN);
  // if (potVal > 2000)
  // {
  //   servoManager.grantAccess(&neoPixelManager, &displayManager);
  //   delay(5000);
  // }

  delay(10);
}
