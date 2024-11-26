// utils/constants.js

export const tools = [
  {
    type: 'function',
    function: {
      name: 'getTemperatureAndHumidityAndLight',
      description:
        'Truy vấn (nhiệt độ(C), độ sáng(lux), độ ẩm(%), mức độ cảnh báo) hiện tại thông qua hệ thống fire_smoke nhờ vào cảm biến.',
    },
  },
];

export const getHTMLTemplate = (device_name, temperature, url) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Temperature Alert</title>
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
      background-color: #e74c3c;
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
      color: #e74c3c;
    }
    .device-status {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      border: 1px solid #e0e0e0;
    }
    .alert {
      background-color: #f2dede;
      color: #a94442;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #ebccd1;
    }
    .button-container {
        text-align: center;
        margin-top: 20px;
    }

    .button {
        display: inline-block;
        padding: 10px 20px;
        color: #ffffff;
        background-color: #e74c3c;
        text-decoration: none;
        border-radius: 4px;
    }

    .button:hover {
        background-color: #c0392b;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      font-size: 12px;
      color: #777777;
    }
    .footer a {
      color: #e74c3c;
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
      <h1>Temperature Alert</h1>
      <p>Warning: High Temperature Detected!</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Urgent: Temperature Too High</h2>
      <p>Dear User,</p>
      <p>We are notifying you that the temperature in your smart home is too high. Please take action to prevent any potential damage or discomfort:</p>
      
      <!-- Device Status Section -->
      <div class="device-status">
        <p><strong>Device:</strong> ${device_name}</p>
        <p><strong>Status:</strong> Temperature is ${temperature}°C (High Alert)</p>
      </div>

      <!-- Alert Message -->
      <div class="alert">
        <p><strong>Alert:</strong> The temperature is dangerously high. Immediate action is recommended.</p>
      </div>
      
      <p>If you didn’t initiate these changes, please check your HomePilot app immediately for further details.</p>

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
};

export default {
  tools,
  getHTMLTemplate,
};
