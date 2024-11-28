#ifndef Ultrasonic_H
#define Ultrasonic_H

#include <Arduino.h>

// ultrasonic sensor class

class UltraSonic
{
private:
    int trigPin;
    int echoPin;
    long duration;
    int distance;

public:
    UltraSonic(int trigPin, int echoPin);
    void setup();
    int read();
};

#endif