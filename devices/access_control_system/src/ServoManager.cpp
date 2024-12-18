// ServoManager.cpp
#include "ServoManager.h"

/**
 * @brief Initializes the ServoManager to control the servo.
 *
 * This function sets up the servo and moves it to the locked position.
 */
void ServoManager::init()
{
  myServo.attach(SERVO_PIN);
  myServo.write(0); // Locked position
}

/**
 * @brief Grants access to the door.
 *
 * This function displays "Access Granted" on the LCD, sets the NeoPixel
 * ring to green, and moves the servo to the unlock position for 5 seconds.
 * After 5 seconds, the door is locked again and the LCD shows "Door Locked"
 * with the NeoPixel ring set to ready.
 *
 * @param[in] neoPixelManager The NeoPixelManager object to use to change the
 *            color of the ring.
 * @param[in] displayManager The DisplayManager object to use to display
 *            messages on the LCD.
 */
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
