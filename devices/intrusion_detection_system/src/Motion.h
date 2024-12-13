#ifndef Motion_H
#define Motion_H

#include <Arduino.h>

// PIR motion sensor class
class Motion
{
private:
    int pin;

public:
    Motion(int pin);
    void setup();
    int read();
};

#endif
