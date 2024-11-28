#ifndef OLED_H
#define OLED_H

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// SSD1306 OLED display class

class OLED {
private:
    int sdaPin;
    int sclPin;
    Adafruit_SSD1306 display = Adafruit_SSD1306(128, 64, &Wire);

public:
    OLED(int sdaPin, int sclPin);
    void setup();
    void showMessage(String message); // Renamed method
};

#endif
