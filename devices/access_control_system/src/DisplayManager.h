// DisplayManager.h
#ifndef DISPLAYMANAGER_H
#define DISPLAYMANAGER_H

#include <LiquidCrystal_I2C.h>

class DisplayManager
{
public:
  void init();
  void showMessage(const char *message, int row = 0);
  void clearScreen();
  void showMenu();
  void showUnlockMessage();
  void showChangePINMessage();
  void showNewPINMessage();
  void showDigitErrorMessage();

private:
  const uint8_t I2C_ADDR = 0x27;
  const uint8_t LCD_COLUMNS = 20;
  const uint8_t LCD_LINES = 4;
  LiquidCrystal_I2C lcd{I2C_ADDR, LCD_COLUMNS, LCD_LINES};
};

#endif
