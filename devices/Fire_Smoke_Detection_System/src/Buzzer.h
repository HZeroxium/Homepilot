#ifndef BUZZER_H
#define BUZZER_H

#include <Arduino.h>

class Buzzer {
private:
    int pin;
    bool state;
    unsigned long previousMillis;
    long interval;

public:
    Buzzer(int pin, long interval);
    void setup();
    void update();
    void turnOff();
    void turnOn();
};

#endif