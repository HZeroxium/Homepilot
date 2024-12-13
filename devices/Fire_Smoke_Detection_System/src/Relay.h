#ifndef RELAY_H
#define RELAY_H

#include <Arduino.h>

class Relay {
private:
    int pin;

public:
    Relay(int pin);
    void setup();
    void activate();
    void deactivate();
};

#endif
