#include "Led.h"

Led::Led(int pin) : pin(pin), state(false) {}

void Led::setup() {
    pinMode(pin, OUTPUT);
    off(); // Ensure the LED is off initially
}

void Led::on() {
    state = true;
    digitalWrite(pin, HIGH);
}

void Led::off() {
    state = false;
    digitalWrite(pin, LOW);
}

