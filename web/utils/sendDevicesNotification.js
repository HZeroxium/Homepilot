require('dotenv').config();
const Push = require('pushsafer-notifications');

/**
 * Sends a push notification using Pushsafer.
 *
 * @param {string} message - The main content of the notification (required).
 * @param {string} [title="Notification"] - The title of the notification (optional).
 * @param {string} [deviceId=process.env.PUSHSAFER_DEVICE_ID] - The target device ID (optional).
 * @returns {Promise<object>} A promise that resolves with the result of the notification or rejects with an error.
 */
function sendPushNotification(message, title = "Notification", deviceId = process.env.PUSHSAFER_DEVICE_ID) {
    // Initialize Pushsafer with the private key
    const pushClient = new Push({
        k: process.env.PUSHSAFER_PRIVATE_KEY, // Private key from .env file
        debug: true,
    });

    // Define the notification payload
    const notificationPayload = {
        m: message,                     // Message body (required)
        t: title,                       // Title (optional, defaults to "Notification")
        s: '8',                         // Sound (value 0-50, optional)
        v: '2',                         // Vibration (value 1-3, optional)
        i: '5',                         // Icon (value 1-176, optional)
        c: '#FF0000',                   // Icon color in hex format (optional)
        u: 'https://www.pushsafer.com', // URL (optional)
        ut: 'Open Link',                // URL title (optional)
        d: deviceId,                    // Device ID or group ID (optional)
    };

    // Return a promise to handle asynchronous notification sending
    return new Promise((resolve, reject) => {
        pushClient.send(notificationPayload, (error, result) => {
            if (error) {
                reject(error); // Reject the promise on error
            } else {
                resolve(result); // Resolve the promise with the result
            }
        });
    });
}

// Export the function
module.exports = { sendPushNotification };