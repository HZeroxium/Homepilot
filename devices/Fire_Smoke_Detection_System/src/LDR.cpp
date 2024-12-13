#include "LDR.h"

LDR::LDR(int pin) : pin(pin) {}

void LDR::setup() {
    pinMode(pin, INPUT);
}

int LDR::read() {
    return analogRead(pin);
}
