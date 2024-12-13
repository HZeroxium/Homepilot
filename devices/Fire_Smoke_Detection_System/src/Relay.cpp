#include "Relay.h"

Relay::Relay(int pin) : pin(pin) {}

void Relay::setup() {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
}

void Relay::activate() {
    digitalWrite(pin, HIGH);
}

void Relay::deactivate() {
    digitalWrite(pin, LOW);
}
