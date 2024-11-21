#include "DHTSensor.h"

DHTSensor::DHTSensor(int pin, int type) : dht(pin, type) {}

void DHTSensor::setup() {
    dht.begin();
}

float DHTSensor::readTemperature() {
    return dht.readTemperature();
}

float DHTSensor::readHumidity() {
    return dht.readHumidity();
}
