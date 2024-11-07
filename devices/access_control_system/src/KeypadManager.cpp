#include "KeypadManager.h"
#include <Keypad.h>

const byte ROWS = 4; // Four rows
const byte COLS = 4; // Four columns
char keys[ROWS][COLS] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}};
uint8_t colPins[COLS] = {26, 25, 33, 32}; // C1, C2, C3, C4
uint8_t rowPins[ROWS] = {13, 12, 14, 27}; // R1, R2, R3, R4

// Constructor for KeypadManager class
// Initializes the keypad with the specified keymap, row pins, and column pins
KeypadManager::KeypadManager() : keypad{makeKeymap(keys), rowPins, colPins, ROWS, COLS} {}

/**
 * @brief Initializes the KeypadManager with the given DisplayManager object.
 *
 * This function sets the DisplayManager object to be used for displaying
 * messages. It should be called before calling handleKeypadInput() to display
 * messages on the LCD.
 *
 * @param[in] display The DisplayManager object to use for displaying messages.
 */
void KeypadManager::init(DisplayManager *display)
{
  displayManager = display;
}

/**
 * @brief Handles keypad input to unlock the door.
 *
 * This function reads the keypad and checks if the input PIN matches the valid
 * PIN. If the input PIN is valid, the door is unlocked using the ServoManager.
 * If not, an "Invalid PIN" message is displayed on the LCD using the
 * DisplayManager.
 *
 * @param[in] servoManager The ServoManager object to use to unlock the door.
 * @param[in] neoPixelManager The NeoPixelManager object to use to change the
 *            color of the ring.
 * @param[in] mqttManager The MQTTManager object to use to send the MQTT
 *            message.
 */
void KeypadManager::handleKeypadInput(ServoManager *servoManager, NeoPixelManager *neoPixelManager, MQTTManager *mqttManager)
{
  char key = keypad.getKey();
  if (key)
  {
    // Show the key pressed on the display
    displayManager->showMessage(String(key).c_str(), 1);
    if (key == '#')
    {
      int result = servoManager->validatePIN(neoPixelManager, displayManager, inputPIN);
      inputPIN = "";
      if (result == 1)
      {
        mqttManager->publishData("direct", "grant");
      }
      else
      {
        mqttManager->publishData("direct", "deny");
        displayManager->showMessage("Invalid PIN");
      }
    }
    else
    {
      inputPIN += key;
    }
  }
}

String KeypadManager::handleNewPINInput()
{
  return updatePassWordStr;
}
