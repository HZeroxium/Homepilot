import dotenv from 'dotenv';
// import sgMail from '@sendgrid/mail';
import Push from 'pushsafer-notifications';
import { getTemperatureHTMLTemplate } from '../utils/constants.js';
import { getAnomalyHTMLTemplate } from '../utils/anomalyEmail.js';
import nodemailer from 'nodemailer';

dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    
    // Generate HTML content based on the template
    if (template === 'temperature') {
      html = getTemperatureHTMLTemplate(device_name, temperature);
    } else if (template === 'anomaly') {
      html = getAnomalyHTMLTemplate(device_name);
    }

    // Configure the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // Use 465 if you prefer SSL
      secure: false, // Set to true for port 465
      auth: {
        user: 'homepilothcmus@gmail.com', // Replace with your Gmail address
        pass: 'obqi lfkd mvai wlxb', // Use an App Password if 2FA is enabled
      },
    });

    const mailOptions = {
      from, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    };

    try {
      // Send email using the transporter
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  static async sendDevicesNotification({
    message,
    title = 'Notification',
    deviceId,
    userPrivateKey,
  }) {
    if (deviceId === undefined || userPrivateKey === undefined) {
      console.log('Device ID and user private key are required.');
      return;
    }
    // Initialize Pushsafer with the private key
    const pushClient = new Push({
      k: userPrivateKey, // Private key from .env file
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

export default NotificationService;
