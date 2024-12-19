// NeoPixelManager.cpp
#include "NeoPixelManager.h"

void NeoPixelManager::init()
{
  strip.begin();
  strip.show();
  strip.setBrightness(250);
}

void NeoPixelManager::setColor(uint8_t r, uint8_t g, uint8_t b, uint8_t delayTime)
{
  for (int i = 0; i < strip.numPixels(); i++)
  {
    strip.setPixelColor(i, strip.Color(r, g, b));
    delay(delayTime);
  }
  strip.show();
}

void NeoPixelManager::setReady(uint8_t delayTime)
{
  setColor(0, 0, 255, delayTime); // Blue indicates system ready
}

void NeoPixelManager::setError(uint8_t delayTime)
{
  setColor(255, 0, 0, delayTime); // Red indicates error
}

void NeoPixelManager::setValid(uint8_t delayTime)
{
  setColor(0, 255, 0, delayTime); // Green indicates valid
}

void NeoPixelManager::setWaiting(uint8_t delayTime)
{
  setColor(255, 255, 0, delayTime); // Yellow indicates warning
}
