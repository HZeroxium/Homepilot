#include "DisplayManager.h"

/**
 * @brief Initializes the LCD display.
 *
 * This function initializes the LCD display by calling lcd.init(), turning on
 * the backlight with lcd.backlight(), and clearing the display with lcd.clear().
 */
void DisplayManager::init()
{
  lcd.init();
  lcd.backlight();
  lcd.clear();
}

/**
 * @brief Shows a message on the LCD display.
 *
 * This function shows a message on the LCD display at the specified row.
 * Before printing the message, it clears the current row by writing a string of
 * spaces to the row. If the row is not specified, it defaults to 0.
 *
 * @param[in] message The message to be shown on the LCD display.
 * @param[in] row The row on which the message should be shown. Defaults to 0.
 */
void DisplayManager::showMessage(const char *message, int row)
{
  lcd.setCursor(0, row);
  lcd.print("                    "); // Clear current row
  lcd.setCursor(0, row);
  lcd.print(message);
}
