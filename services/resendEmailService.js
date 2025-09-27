const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Send payment confirmation email via Resend
async function sendPaymentConfirmation(email, name, course, orderId) {
  try {
    console.log(`Sending payment confirmation email via Resend to: ${email}`);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'nareshkallimani09@gmail.com',
      to: [email],
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
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Resend email sent successfully:', data);
    return { success: true, data: data };

  } catch (error) {
    console.error('Resend email service error:', error);
    return { success: false, error: error.message };
  }
}

// Send test email via Resend
async function sendTestEmail() {
  try {
    console.log('Sending test email via Resend...');
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'nareshkallimani09@gmail.com',
      to: [process.env.RESEND_FROM_EMAIL || 'nareshkallimani09@gmail.com'],
      subject: 'Test Email from ZeroKost Courses',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Test Email</h2>
          <p>This is a test email from your ZeroKost Courses backend.</p>
          <p>If you're receiving this, your Resend email service is working correctly!</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend test email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Resend test email sent successfully:', data);
    return { success: true, data: data };

  } catch (error) {
    console.error('Resend test email service error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPaymentConfirmation,
  sendTestEmail
};
