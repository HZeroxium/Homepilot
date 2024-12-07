#include "Buzzer.h"

Buzzer::Buzzer(int pin, long interval) 
    : pin(pin), interval(interval), previousMillis(0), state(false) {
}

void Buzzer::setup() {
    pinMode(pin, OUTPUT);
    ledcSetup(0, 1000, 8); // Channel 0, 1000 Hz frequency, 8-bit resolution (0-255)
    ledcAttachPin(pin, 0); // Attach the buzzer pin to PWM channel 0
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
    tone(pin, 1000);
}

void Buzzer::off() {
    state = false;
    noTone(pin);
}
