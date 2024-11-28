#ifndef LED_H
#define LED_H

#include <Arduino.h>

class Led {
private:
    int pin;
    bool state;

public:
    Led(int pin);
    void setup();
    void on();
    void off();
};

#endif