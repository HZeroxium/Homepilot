// KeypadManager.cpp
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

void KeypadManager::handleKeypadInput(ServoManager *servoManager, NeoPixelManager *neoPixelManager, MQTTManager *mqttManager)
{
  static String currentMode = ""; // Tracks the current mode: "A" (Unlock), "B" (Change PIN)
  static String tempPIN = "";     // Temporary storage for the PIN being entered

  char key = keypad.getKey(); // Read key press
  if (key)
  {
    Serial.println(String("Key Pressed: ") + key);       // Debugging log
    displayManager->showMessage(String(key).c_str(), 1); // Display the pressed key

    // Handle 'C' to reset states
    if (key == 'C')
    {
      resetState(currentMode, tempPIN, neoPixelManager);
      return;
    }

    // Handle modes based on the currentMode state
    if (currentMode == "A")
    {
      handleUnlockMode(key, servoManager, neoPixelManager, mqttManager, currentMode, tempPIN);
    }
    else if (currentMode == "B")
    {
      handleChangePINMode(key, servoManager, neoPixelManager, currentMode, tempPIN);
    }
    else
    {
      handleModeSelection(key, currentMode, neoPixelManager);
    }
  }
}

void KeypadManager::handleUnlockMode(char key, ServoManager *servoManager, NeoPixelManager *neoPixelManager, MQTTManager *mqttManager, String &currentMode, String &tempPIN)
{
  if (key == '#') // Confirm entered PIN
  {
    if (servoManager->validatePIN(neoPixelManager, displayManager, tempPIN))
    {
      displayManager->showMessage("Access Granted!");
      neoPixelManager->setValid(); // Indicate success
      mqttManager->publishData("direct", "grant");
      Serial.println("Access granted."); // Debug log

      // Reset display to default state after a delay
      delay(2000); // Optional: Adjust delay as needed
      displayManager->showMessage("Choose Mode (A/B):");
      neoPixelManager->setReady(); // Reset NeoPixel to ready state
    }
    else
    {
      displayManager->showMessage("Invalid PIN");
      neoPixelManager->setError(); // Indicate error
      mqttManager->publishData("direct", "deny");
      Serial.println("Invalid PIN entered."); // Debug log
    }
    tempPIN = "";     // Clear PIN
    currentMode = ""; // Reset to default mode
  }
  else if (isdigit(key)) // Append digits to PIN
  {
    tempPIN += key;
    Serial.println("Building PIN: " + tempPIN); // Debug log
  }
  else
  {
    displayManager->showMessage("Invalid Key"); // Invalid key
    Serial.println("Error: Invalid key in unlock mode.");
  }
}

void KeypadManager::handleChangePINMode(char key, ServoManager *servoManager, NeoPixelManager *neoPixelManager, String &currentMode, String &tempPIN)
{
  static bool isEnteringNewPIN = false; // Tracks whether we are entering the new PIN
  static String newPIN = "";            // Temporary storage for new PIN

  if (key == '#') // Confirm action
  {
    if (!isEnteringNewPIN) // Validate current PIN
    {
      if (servoManager->validatePIN(neoPixelManager, displayManager, tempPIN))
      {
        displayManager->showMessage("PIN Validated");
        neoPixelManager->setValid(); // Indicate success
        Serial.println("Current PIN validated. Ready to enter new PIN.");

        delay(1500); // Optional: Briefly show "PIN Validated"
        displayManager->showMessage("Enter New PIN:");
        isEnteringNewPIN = true;
        tempPIN = ""; // Reset temp PIN for new input
      }
      else
      {
        displayManager->showMessage("Invalid Current PIN");
        neoPixelManager->setError(); // Indicate error
        Serial.println("Invalid current PIN entered.");
        tempPIN = "";
        currentMode = ""; // Reset to default mode
      }
    }
    else // Validate and save new PIN
    {
      if (newPIN.length() >= 4)
      {
        servoManager->setValidPIN(newPIN);
        displayManager->showMessage("PIN Updated!");
        neoPixelManager->setValid(); // Indicate success
        Serial.println("New PIN set successfully: " + newPIN);
        newPIN = "";
        isEnteringNewPIN = false;
        currentMode = ""; // Reset to default mode
      }
      else
      {
        displayManager->showMessage("PIN Too Short");
        neoPixelManager->setError(); // Indicate error
        Serial.println("Error: New PIN too short.");
        newPIN = ""; // Reset new PIN
      }
    }
  }
  else if (isdigit(key)) // Append digits to current PIN or new PIN
  {
    if (!isEnteringNewPIN)
    {
      tempPIN += key;
      Serial.println("Building Current PIN: " + tempPIN); // Debug log
    }
    else
    {
      newPIN += key;
      Serial.println("Building New PIN: " + newPIN); // Debug log
    }
  }
  else
  {
    displayManager->showMessage("Invalid Key"); // Invalid key
    Serial.println("Error: Invalid key in change PIN mode.");
  }
}

void KeypadManager::resetState(String &currentMode, String &tempPIN, NeoPixelManager *neoPixelManager)
{
  currentMode = "";            // Reset mode
  tempPIN = "";                // Clear PIN
  neoPixelManager->setReady(); // Indicate system ready
  displayManager->showMessage("System Ready");
  Serial.println("System reset to default state.");
}

void KeypadManager::handleModeSelection(char key, String &currentMode, NeoPixelManager *neoPixelManager)
{
  if (key == 'A')
  {
    currentMode = "A"; // Set mode to Unlock
    displayManager->showMessage("Enter PIN:");
    neoPixelManager->setReady(); // Indicate ready state
    Serial.println("Mode set to Unlock.");
  }
  else if (key == 'B')
  {
    currentMode = "B"; // Set mode to Change PIN
    displayManager->showMessage("Enter Current PIN:");
    neoPixelManager->setReady(); // Indicate ready state
    Serial.println("Mode set to Change PIN.");
  }
  else
  {
    displayManager->showMessage("Invalid Key"); // Invalid key
    Serial.println("Error: Invalid mode selection.");
  }
}

String KeypadManager::handleNewPINInput()
{
  return updatePassWordStr;
}
