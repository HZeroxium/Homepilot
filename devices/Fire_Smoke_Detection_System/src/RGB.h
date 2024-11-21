#ifndef RGB_H
#define RGB_H

#include <Arduino.h>

class RGB {
private:
    int redPin, greenPin, bluePin;

public:
    RGB(int redPin, int greenPin, int bluePin);
    void setup();
    void setColor(int red, int green, int blue);
};

#endif
