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
  String handleNewPINInput();

private:
  Keypad keypad;
  String inputPIN = "";
  DisplayManager *displayManager;
  String updatePassWordStr = "ABCD";
};

#endif
