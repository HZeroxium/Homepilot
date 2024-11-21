#ifndef LDR_H
#define LDR_H

#include <Arduino.h>

class LDR {
private:
    int pin;

public:
    LDR(int pin);
    void setup();
    int read();
};

#endif
