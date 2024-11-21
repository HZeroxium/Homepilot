#ifndef FIREALARMSYSTEM_H
#define FIREALARMSYSTEM_H

#include "RGB.h"
#include "Buzzer.h"
#include "LDR.h"
#include "DHTSensor.h"
#include "Relay.h"

class FireAlarmSystem {
private:
    RGB rgb;
    Buzzer buzzer;
    LDR ldr;
    DHTSensor dht;
    Relay relay;
    int lightThreshold;
    float tempThreshold;
    bool isActivate;

public:
    FireAlarmSystem(RGB rgb, Buzzer buzzer, LDR ldr, DHTSensor dht, Relay relay, int lightThreshold, float tempThreshold);
    void setup();
    void update();
    void activate();
    void deactivate();
    float readTemperature();
    float readHumidity();
    unsigned int readLightLevel();
    bool checkAlert();
};

#endif
