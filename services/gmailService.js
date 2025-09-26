// Clean Gmail-only email service
const nodemailer = require('nodemailer');

// Gmail configuration
const GMAIL_USER = 'zerokosthealthcare@gmail.com';
const GMAIL_PASS = 'mpkk nuhi npld tgoz';

// Create Gmail transporter
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    },
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    
    const transporter = createGmailTransporter();
    
    const mailOptions = {
      from: GMAIL_USER,
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    await transporter.close();
    
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Payment confirmation email template
const createPaymentConfirmationTemplate = (name, course, orderId) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Confirmed</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
            .course-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
            .payment-info { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #28a745; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">🎉</div>
                <h1>Payment Confirmed!</h1>
                <p>Your course registration is complete</p>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p><strong>🎉 Congratulations!</strong> Your payment has been processed successfully.</p>
                
                <div class="course-info">
                    <h3>📚 Course Details</h3>
                    <p><strong>Course:</strong> ${course}</p>
                    <p><strong>Price Paid:</strong> ₹9/-</p>
                    <p><strong>Status:</strong> ✅ Payment Confirmed</p>
                </div>
                
                <div class="payment-info">
                    <h3>💳 Payment Information</h3>
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Payment Status:</strong> ✅ Successfully Processed</p>
                    <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p>Thank you for choosing our course! You will receive course access details within 24 hours.</p>
                
                <p><strong>Best regards,<br>Course Registration Team</strong></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send payment confirmation email
const sendPaymentConfirmation = async (email, name, course, orderId) => {
  const subject = `🎉 Payment Confirmed - ${course}`;
  const html = createPaymentConfirmationTemplate(name, course, orderId);
  
  return await sendEmail(email, subject, html);
};

// Test email function
const sendTestEmail = async (email) => {
  const subject = '📧 Gmail Test - Success!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Gmail Test</title>
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
                <div class="success-icon">📧</div>
                <h1>Gmail Test Successful!</h1>
                <p>Your Gmail email system is working</p>
            </div>
            <div class="content">
                <h2>Test Details:</h2>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
                <p><strong>Email Service:</strong> Gmail SMTP</p>
                <p><strong>Status:</strong> ✅ Working</p>
                <p>This confirms that your Gmail email system is properly configured and ready to send payment confirmation emails.</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendPaymentConfirmation,
  sendTestEmail
};
