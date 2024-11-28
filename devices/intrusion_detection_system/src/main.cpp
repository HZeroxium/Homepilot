#include <Arduino.h>
#include "IntrusionSystem.h"
#include "WifiManager.h"
#include "MQTTManager.h"

// Define pins and thresholds
#define TRIG_PIN 4         // Ultrasonic Trig
#define ECHO_PIN 5         // Ultrasonic Echo
#define PIR_PIN 19         // PIR Sensor
#define LED_PIN 17         // LED
#define BUZZER_PIN 15      // Buzzer

const int distanceThreshold = 20;

// Instantiate components
UltraSonic ultrasonic(TRIG_PIN, ECHO_PIN);
Motion motion(PIR_PIN);
Led led(LED_PIN);
Buzzer buzzer(BUZZER_PIN, 500);
OLED oled(21, 22);
MQTTManager mqttManager;
// Instantiate system
IntrusionSystem intrusionSystem(motion, led, buzzer, oled, ultrasonic, distanceThreshold);

void setup() {
    Serial.begin(115200);
    WiFiManager wifiManager;
    wifiManager.connect();

    intrusionSystem.setup();
    mqttManager.init(wifiManager.getClient(), &intrusionSystem);

}

void loop() {
    intrusionSystem.update();
    mqttManager.loop();
}
