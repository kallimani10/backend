// Simple email service for immediate testing without complex configuration
const nodemailer = require('nodemailer');

// Simple email sending function that works with basic Gmail setup
const sendSimpleEmail = async (to, subject, html) => {
  try {
    // Use a simple Gmail configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nareshkallimani09@gmail.com', // Your Gmail
        pass: 'zwat ekzv fxnj lczy' // Your App Password
      },
      connectionTimeout: 5000,  // 5 seconds only
      greetingTimeout: 3000,    // 3 seconds only
      socketTimeout: 5000       // 5 seconds only
    });

    const mailOptions = {
      from: 'nareshkallimani09@gmail.com',
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Simple email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Simple email failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test email function with payment confirmation template
const testEmail = async () => {
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Test Email - Payment Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">🧪</div>
                <h1>Email Test Successful!</h1>
                <p>Your email system is working correctly</p>
            </div>
            <div class="content">
                <h2>Test Details:</h2>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
                <p><strong>Email Service:</strong> Gmail SMTP</p>
                <p><strong>Status:</strong> ✅ Working</p>
                <p>This confirms that your email system is properly configured and ready to send payment confirmation emails.</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return await sendSimpleEmail('vaibhavbkalungada@gmail.com', '🧪 Email System Test - Success!', testHtml);
};

module.exports = {
  sendSimpleEmail,
  testEmail
};
