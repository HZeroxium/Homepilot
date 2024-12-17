export const getAnomalyHTMLTemplate = (device_name, url) => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Door Opening Anomaly Alert</title>
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
          <h1>Door Opening Anomaly Alert</h1>
          <p>Warning: Unusual Door Open Time Detected!</p>
        </div>
    
        <!-- Content -->
        <div class="content">
          <h2>Urgent: Door Open Time Anomaly</h2>
          <p>Dear User,</p>
          <p>We detected an unusual door opening time for your monitored device. Please verify this activity as it may indicate a security risk:</p>
          
          <!-- Device Status Section -->
          <div class="device-status">
            <p><strong>Device:</strong> ${device_name}</p>
            <p><strong>Anomaly Detected</p>
          </div>
    
          <!-- Alert Message -->
          <div class="alert">
            <p><strong>Alert:</strong> The door has been open for an unusually long time. Please investigate immediately.</p>
          </div>
          
          <p>If this activity wasn’t expected, please check your HomePilot app immediately for further details.</p>
    
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
