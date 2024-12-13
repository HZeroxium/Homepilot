#include <Arduino.h>
#include "FireAlarmSystem.h"
#include "WifiManager.h"
#include "MQTTManager.h"

// Define pins and thresholds
#define DHTPIN 15
#define LDRPIN 36
#define RELAYPIN 14
#define RGBREDPIN 12
#define RGBGREENPIN 13
#define RGBBLUEPIN 27
#define BUZZERPIN 5

const int lightThreshold = 200; // Light level for detecting fire
const float tempThreshold = 50.0; // Temperature threshold for fire alert
const long buzzerInterval = 500; // Interval for buzzer on/off

// Instantiate components
RGB rgb(RGBREDPIN, RGBGREENPIN, RGBBLUEPIN);
Buzzer buzzer(BUZZERPIN, buzzerInterval);
LDR ldr(LDRPIN);
DHTSensor dht(DHTPIN, DHT22);
Relay relay(RELAYPIN);
WiFiManager wifiManager;
MQTTManager mqttManager;

// Instantiate the FireAlarmSystem object
FireAlarmSystem fireAlarm(rgb, buzzer, ldr, dht, relay, lightThreshold, tempThreshold);

void setup() {
    fireAlarm.setup();
    wifiManager.connect();
    mqttManager.init(wifiManager.getClient(), &fireAlarm);
}

void loop() {
    fireAlarm.update();
    mqttManager.loop();
}
