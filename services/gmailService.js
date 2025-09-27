const nodemailer = require('nodemailer');

// Create Gmail transporter with timeout and retry settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,   // 30 seconds
  socketTimeout: 60000,      // 60 seconds
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  rateDelta: 20000,         // 20 seconds
  rateLimit: 5
});

// Send payment confirmation email via Gmail with retry logic
async function sendPaymentConfirmation(email, name, course, orderId) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Sending payment confirmation email via Gmail to: ${email} (attempt ${attempt}/${maxRetries})`);
      
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Payment Confirmation - ${course}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Payment Confirmation</h2>
            
            <p>Dear ${name},</p>
            
            <p>Thank you for your payment! Your registration for <strong>${course}</strong> has been confirmed.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #28a745; margin-top: 0;">Registration Details:</h3>
              <p><strong>Course:</strong> ${course}</p>
              <p><strong>Order ID:</strong> ${orderId || 'N/A'}</p>
              <p><strong>Status:</strong> <span style="color: #28a745;">Confirmed</span></p>
            </div>
            
            <p>You will receive further instructions about accessing your course materials shortly.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              ZeroKost Courses Team
            </p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Gmail email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      lastError = error;
      console.error(`Gmail email attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // 2, 4, 6 seconds
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('Gmail email service failed after all retries:', lastError);
  return { success: false, error: lastError.message };
}

module.exports = {
  sendPaymentConfirmation
};
