#ifndef NEOPIXELMANAGER_H
#define NEOPIXELMANAGER_H

#include <Adafruit_NeoPixel.h>

class NeoPixelManager
{
public:
  void init();
  void setColor(uint8_t r, uint8_t g, uint8_t b);
  void setReady();
  void setError();
  void setValid();

private:
  const uint8_t LED_PIN = 17;
  const uint8_t LED_COUNT = 16;
  Adafruit_NeoPixel strip{LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800};
};

#endif
