// ServoManager.cpp
#include "ServoManager.h"

void ServoManager::init()
{
  myServo.attach(SERVO_PIN);
  myServo.write(0); // Locked position
}

int ServoManager::validatePIN(NeoPixelManager *neoPixelManager, DisplayManager *displayManager, String inputPIN)
{
  return inputPIN == validPIN;
}

void ServoManager::grantAccess(NeoPixelManager *neoPixelManager, DisplayManager *displayManager)
{
  displayManager->clearScreen();
  displayManager->showMessage("Access Granted");
  neoPixelManager->setValid();
  myServo.write(90); // Unlock position
  delay(5000);       // Keep door unlocked for 5 seconds
  myServo.write(0);  // Lock again
  displayManager->showMessage("Door Locked");
  neoPixelManager->setWaiting();
}

String ServoManager::getValidPIN()
{
  return validPIN;
}

void ServoManager::setValidPIN(String pin)
{
  validPIN = pin;
}
