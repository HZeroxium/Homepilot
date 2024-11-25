# Setup Instructions

## Pushsafer Notifications Setup
1. Go to [Pushsafer](https://www.pushsafer.com/) to register an account.
2. Create a private key.
3. Register a device for the device ID (on your phone device).
4. Add the values to your `.env` file:
   - `PUSHSAFER_PRIVATE_KEY`
   - `PUSHSAFER_DEVICE_ID`

## GROQ Setup
1. Go to [GROQ Console](https://console.groq.com) to register an account.
2. Create a private key.
3. Add the private key as `GROQ_API_KEY` in your `.env` file.

## Sendgrid/Mail Setup
1. Go to [Sendgrid](https://sendgrid.com/en-us) to register an account.
2. Register for a sender email, receiver email, and an API key.
3. Add the values to your `.env` file:
   - `EMAIL_SENDER`
   - `EMAIL_RECEIVER`
   - `SENDGRID_API_KEY`
