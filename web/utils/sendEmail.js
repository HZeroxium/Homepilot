require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email using SendGrid.
 * 
 * @param {string} to       - The recipient's email address.
 * @param {string} from     - The sender's verified email address.
 * @param {string} subject  - The subject of the email.
 * @param {string} text     - The plain text content of the email.
 * @param {string} html     - The HTML content of the email.
 */
const sendEmail = async (to, from, subject, text, html) => {
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
};

const url = 'https://localhost:3000';

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HomePilot Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #0078d7;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      margin: 0 0 10px;
      font-size: 20px;
      color: #0078d7;
    }
    .device-status {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      border: 1px solid #e0e0e0;
    }
    .button-container {
        text-align: center;
        margin-top: 20px;
    }

    .button {
        display: inline-block;
        padding: 10px 20px;
        color: #ffffff;
        background-color: #0078d7;
        text-decoration: none;
        border-radius: 4px;
    }

    .button:hover {
        background-color: #005bb5;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      font-size: 12px;
      color: #777777;
    }
    .footer a {
      color: #0078d7;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>HomePilot</h1>
      <p>Your Smart Home Assistant</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Notification for Your Smart Home</h2>
      <p>Dear User,</p>
      <p>We wanted to inform you about the latest updates regarding your smart home devices:</p>
      
      <!-- Device Status Section -->
      <div class="device-status">
        <p><strong>Device:</strong> Living Room Thermostat</p>
        <p><strong>Status:</strong> Temperature set to 22°C</p>
      </div>
      <div class="device-status">
        <p><strong>Device:</strong> Front Door Lock</p>
        <p><strong>Status:</strong> Locked</p>
      </div>
      
      <p>If you didn’t initiate these actions, please check your HomePilot app immediately for further details.</p>

      <!-- Call to Action -->
      <div class="button-container">
        <a href="${url}/dashboard" class="button">Go to Dashboard</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Thank you for using HomePilot.</p>
      <p>Need help? <a href="${url}/support">Contact Support</a></p>
      <p>&copy; 2024 HomePilot Inc. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Send the email example
// sendEmail(
//   to='hctuankiet243@gmail.com', 
//   from='hctkiet22@clc.fitus.edu.vn', 
//   subject='[HOMEPILOT] NOTIFICATION', 
//   text='HomePilot Notification', // Plain text fallback
//   html=htmlTemplate // HTML content
// );

module.exports = { sendEmail };