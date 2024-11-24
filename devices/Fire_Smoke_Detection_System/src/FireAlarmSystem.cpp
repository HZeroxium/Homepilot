#include "FireAlarmSystem.h"
#include <Arduino.h>

FireAlarmSystem::FireAlarmSystem(RGB rgb, Buzzer buzzer, LDR ldr, DHTSensor dht, Relay relay, int lightThreshold, float tempThreshold)
    : rgb(rgb), buzzer(buzzer), ldr(ldr), dht(dht), relay(relay), lightThreshold(lightThreshold), tempThreshold(tempThreshold) {}

void FireAlarmSystem::setup() {
    isActivate = true;
    rgb.setup();
    buzzer.setup();
    ldr.setup();
    dht.setup();
    relay.setup();
    Serial.begin(115200);
}

void FireAlarmSystem::update() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int lightLevel = ldr.read();

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C, Humidity: ");
    Serial.print(humidity);
    Serial.print(" %, Light Level: ");
    Serial.println(lightLevel);

    if (!isActivate) {
        relay.deactivate();
        rgb.setColor(0, 255, 0); // Green color for safe state
        buzzer.turnOff(); // Ensure buzzer is off
        return;
    }

    bool fireDetected = checkAlert();

    if (fireDetected) {
        relay.activate();
        rgb.setColor(255, 0, 0); // Red color for fire alert
        buzzer.update(); // Toggle the buzzer
    } else {
        relay.deactivate();
        rgb.setColor(0, 255, 0); // Green color for safe state
        buzzer.turnOff(); // Ensure buzzer is off
    }

    delay(100); // Prevent excessive reading
}


void FireAlarmSystem::activate() {
    isActivate = true;
}

void FireAlarmSystem::deactivate() {
    isActivate = false;
}

float FireAlarmSystem::readTemperature() {
    return dht.readTemperature();
}

float FireAlarmSystem::readHumidity() {
    return dht.readHumidity();
}

unsigned int FireAlarmSystem::readLightLevel() {
    return ldr.read();
}

bool FireAlarmSystem::checkAlert() {
    float temperature = dht.readTemperature();
    int lightLevel = ldr.read();

    return (temperature > tempThreshold || lightLevel < lightThreshold);
}