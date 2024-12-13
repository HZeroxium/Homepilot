#include "RGB.h"

RGB::RGB(int redPin, int greenPin, int bluePin)
    : redPin(redPin), greenPin(greenPin), bluePin(bluePin) {}

void RGB::setup() {
    pinMode(redPin, OUTPUT);
    pinMode(greenPin, OUTPUT);
    pinMode(bluePin, OUTPUT);
}

void RGB::setColor(int red, int green, int blue) {
    analogWrite(redPin, red);
    analogWrite(greenPin, green);
    analogWrite(bluePin, blue);
}
