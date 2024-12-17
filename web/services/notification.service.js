import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import Push from 'pushsafer-notifications';
import { getTemperatureHTMLTemplate } from '../utils/constants.js';
import { getAnomalyHTMLTemplate } from '../utils/anomalyEmail.js';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const url = 'https://localhost:3000';

class NotificationService {
  static async sendEmail({
    template,
    to,
    from,
    subject,
    text,
    device_name,
    temperature,
  }) {
    let html = '';
    if (template === 'temperature') {
      html = getTemperatureHTMLTemplate(device_name, temperature, url);
    } else if (template === 'anomaly') {
      html = getAnomalyHTMLTemplate(device_name, url);
    }
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  static async sendDevicesNotification({
    message,
    title = 'Notification',
    deviceId = process.env.PUSHSAFER_DEVICE_ID,
  }) {
    // Initialize Pushsafer with the private key
    const pushClient = new Push({
      k: process.env.PUSHSAFER_PRIVATE_KEY, // Private key from .env file
      debug: true,
    });

    // Define the notification payload
    const notificationPayload = {
      m: message, // Message body (required)
      t: title, // Title (optional, defaults to "Notification")
      s: '8', // Sound (value 0-50, optional)
      v: '2', // Vibration (value 1-3, optional)
      i: '5', // Icon (value 1-176, optional)
      c: '#FF0000', // Icon color in hex format (optional)
      u: 'https://www.pushsafer.com', // URL (optional)
      ut: 'Open Link', // URL title (optional)
      d: deviceId, // Device ID or group ID (optional)
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
}

// Send the email example
// sendEmail(
//   to='hctuankiet243@gmail.com',
//   from='hctkiet22@clc.fitus.edu.vn',
//   subject='[HOMEPILOT] NOTIFICATION',
//   text='HomePilot Notification', // Plain text fallback
//   html=htmlTemplate // HTML content
// );

export default NotificationService;
