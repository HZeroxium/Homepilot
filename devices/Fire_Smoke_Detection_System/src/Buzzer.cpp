#include "Buzzer.h"

Buzzer::Buzzer(int pin, long interval) : pin(pin), state(LOW), previousMillis(0), interval(interval) {}

void Buzzer::setup() {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
}

void Buzzer::update() {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        state = !state;
        digitalWrite(pin, state);
    }
}

void Buzzer::turnOff() {
    digitalWrite(pin, LOW);
    state = LOW;
}

void Buzzer::turnOn() {
    digitalWrite(pin, HIGH);
    state = HIGH;
}