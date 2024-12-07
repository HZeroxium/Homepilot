#include "IntrusionSystem.h"

IntrusionSystem::IntrusionSystem(Motion &motion, Led &led, Buzzer &buzzer, OLED &oled, UltraSonic &ultrasonic, int safeDistance)
    : motion(motion), led(led), buzzer(buzzer), oled(oled), alarmTriggered(false), previousMillis(0), interval(5000), safeDistance(safeDistance), ultrasonic(ultrasonic)
{
}

void IntrusionSystem::setup()
{
    motion.setup();
    led.setup();
    buzzer.setup();
    oled.setup();
    ultrasonic.setup();
    isActivated = true;
}

int IntrusionSystem::readDistance()
{
    return ultrasonic.read();
}

bool IntrusionSystem::readMotion()
{
    return motion.read();
}

bool IntrusionSystem::isAlarm()
{
    if (readMotion() && readDistance() < safeDistance)
    {
        return true;
    }
    return false;
}

void IntrusionSystem::update()
{
    if (!isActivated)
        return;
    


    // if motion is detected and distance is less than safe distance
    if (isAlarm())
    {
        alarmTriggered = true;
        led.on();
        buzzer.on();
        oled.showMessage("Intruder Alert!");
    }
    else
    {
        alarmTriggered = false;
        led.off();
        buzzer.off();
        oled.showMessage("System Armed");
    }
}

void IntrusionSystem::activate()
{
    isActivated = true;
    oled.showMessage("System Activated");
}

void IntrusionSystem::deactivate()
{
    // turn off all the components
    led.off();
    buzzer.off();
    
    isActivated = false;
    oled.showMessage("System Deactivated");
}

void IntrusionSystem::updateDistance(int distance)
{
    safeDistance = distance;
}