#ifndef IntrusionSystem_H
#define IntrusionSystem_H

#include <Arduino.h>

#include "Motion.h"
#include "Led.h"
#include "Buzzer.h"
#include "OLED.h"
#include "Buzzer.h"
#include "Ultrasonic.h"

class IntrusionSystem
{
public:
    IntrusionSystem(Motion &motion, Led &led, Buzzer &buzzer, OLED &oled, UltraSonic &ultrasonic, int safeDistance);
    int readDistance();
    bool readMotion();
    bool isAlarm();
    void setup();
    void update();
    void activate();
    void deactivate();
    void updateDistance(int distance);

private:
    Motion &motion;
    Led &led;
    Buzzer &buzzer;
    OLED &oled;
    UltraSonic &ultrasonic;
    bool alarmTriggered;
    unsigned long previousMillis;
    unsigned long interval;
    int safeDistance;
    bool isActivated;
};

#endif