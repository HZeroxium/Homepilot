// NeoPixelManager.h
#ifndef NEOPIXELMANAGER_H
#define NEOPIXELMANAGER_H

#include <Adafruit_NeoPixel.h>

class NeoPixelManager
{
public:
  void init();
  void setColor(uint8_t r, uint8_t g, uint8_t b, uint8_t delayTime = 0);
  void setReady(uint8_t delayTime = 0);
  void setError(uint8_t delayTime = 0);
  void setValid(uint8_t delayTime = 0);
  void setWaiting(uint8_t delayTime = 0);

private:
  const uint8_t LED_PIN = 17;
  const uint8_t LED_COUNT = 16;
  Adafruit_NeoPixel strip{LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800};
};

#endif
