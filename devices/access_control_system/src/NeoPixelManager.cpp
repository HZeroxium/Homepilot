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
void NeoPixelManager::setColor(uint8_t r, uint8_t g, uint8_t b)
{
  for (int i = 0; i < strip.numPixels(); i++)
  {
    strip.setPixelColor(i, strip.Color(r, g, b));
  }
  strip.show();
}

/**
 * @brief Sets the NeoPixel strip to indicate system readiness.
 *
 * This function sets the color of all pixels in the NeoPixel strip to blue,
 * which indicates that the system is ready.
 */
void NeoPixelManager::setReady()
{
  setColor(0, 0, 255); // Blue indicates system ready
}

/**
 * @brief Sets the NeoPixel strip to indicate an error.
 *
 * This function sets the color of all pixels in the NeoPixel strip to red,
 * which indicates that an error has occurred.
 */
void NeoPixelManager::setError()
{
  setColor(255, 0, 0); // Red indicates error
}

/**
 * @brief Sets the NeoPixel strip to indicate valid operation.
 *
 * This function sets the color of all pixels in the NeoPixel strip to green,
 * which indicates that the system is operating correctly.
 */
void NeoPixelManager::setValid()
{
  setColor(0, 255, 0); // Green indicates valid
}
