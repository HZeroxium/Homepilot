#include "Motion.h"

Motion::Motion(int pin) : pin(pin) {}

void Motion::setup()
{
    pinMode(pin, INPUT);
}

int Motion::read()
{
    return digitalRead(pin);
}
