#ifndef BUZZER_H
#define BUZZER_H

#include <Arduino.h>

class Buzzer {
private:
    int pin;
    long interval;
    long previousMillis;
    bool state;

public:
    Buzzer(int pin, long interval);
    void setup();
    void update();
    void on();
    void off();
};

#endif 