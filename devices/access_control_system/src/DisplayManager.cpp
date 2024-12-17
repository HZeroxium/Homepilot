// DisplayManager.cpp
#include "DisplayManager.h"

void DisplayManager::init()
{
  lcd.init();
  lcd.backlight();
  lcd.clear();
}

void DisplayManager::showMessage(const char *message, int row)
{
  lcd.setCursor(0, row);
  lcd.print("                    "); // Clear current row
  lcd.setCursor(0, row);
  lcd.print(message);
}

void DisplayManager::clearScreen()
{
  lcd.clear();
}

void DisplayManager::showMenu()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Choose Mode (A/B):");
  lcd.setCursor(0, 1);
  lcd.print("A. Unlock Mode");
  lcd.setCursor(0, 2);
  lcd.print("B. Change PIN");
}

void DisplayManager::showUnlockMessage()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter PIN:");
  lcd.setCursor(0, 1);
  lcd.print("Using digits only.");
  lcd.setCursor(0, 2);
  lcd.print("Press # to confirm.");
  lcd.setCursor(0, 3);
  lcd.print("Press C to cancel.");
}

void DisplayManager::showChangePINMessage()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter Current PIN:");
  lcd.setCursor(0, 1);
  lcd.print("Using digits only.");
  lcd.setCursor(0, 2);
  lcd.print("Press # to confirm.");
  lcd.setCursor(0, 3);
  lcd.print("Press C to cancel.");
}

void DisplayManager::showNewPINMessage()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter New PIN:");
  lcd.setCursor(0, 1);
  lcd.print("Using digits only.");
  lcd.setCursor(0, 2);
  lcd.print("Press # to confirm.");
  lcd.setCursor(0, 3);
  lcd.print("Press C to cancel.");
}

void DisplayManager::showDigitErrorMessage()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Invalid Input.");
  lcd.setCursor(0, 1);
  lcd.print("Using digits only.");
}
