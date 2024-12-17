// KeypadManager.h
#ifndef KEYPADMANAGER_H
#define KEYPADMANAGER_H

#include <Keypad.h>
#include "DisplayManager.h"
#include "ServoManager.h"
#include "MQTTManager.h"

class KeypadManager
{
public:
  KeypadManager();
  void init(DisplayManager *displayManager);
  void handleKeypadInput(ServoManager *servoManager, NeoPixelManager *neoPixelManager, MQTTManager *mqttManager);
  void handleUnlockMode(char key, ServoManager *servoManager, NeoPixelManager *neoPixelManager, MQTTManager *mqttManager, String &currentMode, String &tempPIN);
  void handleChangePINMode(char key, ServoManager *servoManager, NeoPixelManager *neoPixelManager, String &currentMode, String &tempPIN);
  void handleModeSelection(char key, String &currentMode, NeoPixelManager *neoPixelManager);
  void resetState(String &currentMode, String &tempPIN, NeoPixelManager *neoPixelManager);
  String handleNewPINInput();

private:
  Keypad keypad;
  String inputPIN = "";
  DisplayManager *displayManager;
  String updatePassWordStr = "ABCD";
};

#endif
