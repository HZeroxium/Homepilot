#ifndef SERVOMANAGER_H
#define SERVOMANAGER_H

#include <ESP32Servo.h>
#include "NeoPixelManager.h"
#include "DisplayManager.h"

class ServoManager
{
public:
  void init();
  int validatePIN(NeoPixelManager *neoPixelManager, DisplayManager *displayManager, String inputPIN);
  void grantAccess(NeoPixelManager *neoPixelManager, DisplayManager *displayManager);
  String getValidPIN();
  void setValidPIN(String pin);

private:
  const uint8_t SERVO_PIN = 18;
  String validPIN = "1234";
  Servo myServo;
};

#endif
