#include "OLED.h"

OLED::OLED(int sdaPin, int sclPin) : sdaPin(sdaPin), sclPin(sclPin) {}

void OLED::setup() {
    Wire.begin(sdaPin, sclPin);
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("SSD1306 allocation failed"));
        for (;;); // Stop execution
    }
    display.display();
    delay(2000); // Pause for 2 seconds
    display.clearDisplay();
}

void OLED::showMessage(String message) {
    display.clearDisplay();
    display.setTextSize(1); // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0); // Start at top-left corner
    display.println(message);
    display.display();
}
