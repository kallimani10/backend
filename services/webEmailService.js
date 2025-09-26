// Web-based email service that bypasses SMTP blocking
const axios = require('axios');

// EmailJS service configuration (free service that works around SMTP blocking)
const EMAILJS_SERVICE_ID = 'service_zerokost';
const EMAILJS_TEMPLATE_ID = 'template_payment_confirmation';
const EMAILJS_PUBLIC_KEY = 'your_emailjs_public_key';

// Alternative: Use a web-based email API
const sendEmailViaWeb = async (emailData) => {
  try {
    console.log('Attempting web-based email sending...');
    
    // Method 1: Try EmailJS (if configured)
    if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_emailjs_public_key') {
      try {
        const emailjsResult = await sendViaEmailJS(emailData);
        if (emailjsResult.success) {
          return emailjsResult;
        }
      } catch (error) {
        console.log('EmailJS failed, trying alternative method...');
      }
    }
    
    // Method 2: Use a simple web-based email service
    const webResult = await sendViaWebService(emailData);
    return webResult;
    
  } catch (error) {
    console.error('Web email service failed:', error);
    return { success: false, error: error.message };
  }
};

// Send via EmailJS
const sendViaEmailJS = async (emailData) => {
  const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: emailData.to,
      to_name: emailData.name,
      course_name: emailData.course,
      order_id: emailData.orderId,
      message: emailData.html
    }
  });
  
  return { success: true, messageId: response.data };
};

// Send via simple web service (using a free email API)
const sendViaWebService = async (emailData) => {
  try {
    // Using a simple web-based email service
    const emailPayload = {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      from: 'zerokosthealthcare@gmail.com'
    };
    
    // Try multiple free email services
    const services = [
      'https://api.emailjs.com/api/v1.0/email/send',
      'https://api.sendgrid.com/v3/mail/send',
      'https://api.mailgun.net/v3/sandbox.mailgun.org/messages'
    ];
    
    for (const service of services) {
      try {
        console.log(`Trying email service: ${service}`);
        const response = await axios.post(service, emailPayload, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200 || response.status === 202) {
          console.log(`Email sent successfully via ${service}`);
          return { success: true, messageId: response.data?.id || 'web-sent' };
        }
      } catch (serviceError) {
        console.log(`Service ${service} failed:`, serviceError.message);
        continue;
      }
    }
    
    throw new Error('All web email services failed');
    
  } catch (error) {
    console.error('Web service email failed:', error);
    return { success: false, error: error.message };
  }
};

// Create a simple HTML email template
const createSimpleEmailTemplate = (name, course, orderId) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Confirmed</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
            .content { background: white; padding: 20px; border-radius: 8px; }
            .success { color: #28a745; font-weight: bold; }
            .details { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Payment Confirmed!</h1>
                <p>Your course registration is complete</p>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p class="success">🎉 Congratulations! Your payment has been processed successfully.</p>
                
                <div class="details">
                    <h3>📚 Course Details:</h3>
                    <p><strong>Course:</strong> ${course}</p>
                    <p><strong>Price Paid:</strong> ₹9/-</p>
                    <p><strong>Order ID:</strong> ${orderId || 'N/A'}</p>
                    <p><strong>Status:</strong> ✅ Payment Confirmed</p>
                </div>
                
                <p>Thank you for choosing our course! You will receive course access details within 24 hours.</p>
                
                <p><strong>Best regards,<br>Course Registration Team</strong></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Main function to send payment confirmation via web
const sendPaymentConfirmationViaWeb = async (email, name, course, orderId) => {
  try {
    console.log('Sending payment confirmation via web service...');
    
    const emailData = {
      to: email,
      name: name,
      course: course,
      orderId: orderId,
      subject: `🎉 Payment Confirmed - ${course}`,
      html: createSimpleEmailTemplate(name, course, orderId)
    };
    
    const result = await sendEmailViaWeb(emailData);
    
    if (result.success) {
      console.log('Payment confirmation sent via web service successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.log('Web service failed, logging for manual sending');
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('Error sending payment confirmation via web:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmailViaWeb,
  sendPaymentConfirmationViaWeb,
  createSimpleEmailTemplate
};
