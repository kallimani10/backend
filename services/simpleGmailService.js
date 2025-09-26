// Simple Gmail service for immediate email sending
const nodemailer = require('nodemailer');

// Simple Gmail email sending function
const sendSimpleGmailEmail = async (to, subject, html) => {
  try {
    console.log('Sending Gmail email to:', to);
    console.log('Subject:', subject);
    
    // Create simple Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zerokosthealthcare@gmail.com',
        pass: 'mpkk nuhi npld tgoz'
      },
      connectionTimeout: 20000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    });

    console.log('Gmail transporter created');

    const mailOptions = {
      from: 'zerokosthealthcare@gmail.com',
      to: to,
      subject: subject,
      html: html
    };

    console.log('Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    await transporter.close();
    console.log('Transporter closed');
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Gmail email failed:', error.message);
    console.error('Error code:', error.code);
    return { success: false, error: error.message, code: error.code };
  }
};

// Test Gmail email
const testGmailEmail = async () => {
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Gmail Test Email</title>
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
  
  return await sendSimpleGmailEmail('vaibhavbkalungada@gmail.com', '📧 Gmail Test - Success!', testHtml);
};

module.exports = {
  sendSimpleGmailEmail,
  testGmailEmail
};
