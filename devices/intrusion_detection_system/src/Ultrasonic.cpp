#include "Ultrasonic.h" 

UltraSonic::UltraSonic(int trigPin, int echoPin) : trigPin(trigPin), echoPin(echoPin) {}

void UltraSonic::setup() {
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
}

int UltraSonic::read() {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;
    return distance;
}

