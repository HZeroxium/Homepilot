#ifndef DHTSENSOR_H
#define DHTSENSOR_H

#include <DHT.h>

class DHTSensor {
private:
    DHT dht;

public:
    DHTSensor(int pin, int type);
    void setup();
    float readTemperature();
    float readHumidity();
};

#endif
