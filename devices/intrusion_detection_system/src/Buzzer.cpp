#include "Buzzer.h"

Buzzer::Buzzer(int pin, long interval) 
    : pin(pin), interval(interval), previousMillis(0), state(false) {
}

void Buzzer::setup() {
    pinMode(pin, OUTPUT);
    off(); // Ensure the buzzer is off initially
}

void Buzzer::update() {
    long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        state = !state; // Toggle state
        digitalWrite(pin, state ? HIGH : LOW);
    }
}

void Buzzer::on() {
    state = true;
    digitalWrite(pin, HIGH);
}

void Buzzer::off() {
    state = false;
    digitalWrite(pin, LOW);
}
