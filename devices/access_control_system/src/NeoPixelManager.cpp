// NeoPixelManager.cpp
#include "NeoPixelManager.h"

/**
 * @brief Initializes the NeoPixel strip.
 *
 * This function begins the NeoPixel strip, sets all the pixels to off,
 * and adjusts the brightness to a specified level.
 */
void NeoPixelManager::init()
{
  strip.begin();
  strip.show();
  strip.setBrightness(250);
}

/**
 * @brief Sets the color of all pixels in the NeoPixel strip.
 *
 * This function takes 3 parameters, the red, green, and blue components of the color.
 * It sets each pixel in the strip to the given color and then calls show() to
 * display the new color.
 *
 * @param[in] r The red component of the color.
 * @param[in] g The green component of the color.
 * @param[in] b The blue component of the color.
 */
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
