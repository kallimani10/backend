// EmailJS service for sending emails without SMTP
const axios = require('axios');

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_zerokost',
  templateId: 'template_payment_confirmation',
  publicKey: 'user_zerokost_public_key' // This needs to be set up
};

// Send email via EmailJS
const sendEmailViaEmailJS = async (emailData) => {
  try {
    console.log('Sending email via EmailJS...');
    
    const payload = {
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      template_params: {
        to_email: emailData.to,
        to_name: emailData.name,
        course_name: emailData.course,
        order_id: emailData.orderId,
        payment_amount: '₹9/-',
        confirmation_message: 'Your payment has been confirmed successfully!'
      }
    };
    
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('Email sent successfully via EmailJS');
      return { success: true, messageId: response.data, method: 'emailjs' };
    } else {
      throw new Error(`EmailJS returned status ${response.status}`);
    }
    
  } catch (error) {
    console.error('EmailJS failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Create a simple email template for EmailJS
const createEmailJSTemplate = (name, course, orderId) => {
  return {
    subject: `🎉 Payment Confirmed - ${course}`,
    html: `
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
                  <h2>Hello {{to_name}}!</h2>
                  <p class="success">🎉 Congratulations! Your payment has been processed successfully.</p>
                  
                  <div class="details">
                      <h3>📚 Course Details:</h3>
                      <p><strong>Course:</strong> {{course_name}}</p>
                      <p><strong>Price Paid:</strong> {{payment_amount}}</p>
                      <p><strong>Order ID:</strong> {{order_id}}</p>
                      <p><strong>Status:</strong> ✅ Payment Confirmed</p>
                  </div>
                  
                  <p>{{confirmation_message}}</p>
                  
                  <p><strong>Best regards,<br>Course Registration Team</strong></p>
              </div>
          </div>
      </body>
      </html>
    `
  };
};

// Main function to send payment confirmation via EmailJS
const sendPaymentConfirmationViaEmailJS = async (email, name, course, orderId) => {
  try {
    console.log('Sending payment confirmation via EmailJS...');
    
    const emailData = {
      to: email,
      name: name,
      course: course,
      orderId: orderId
    };
    
    const result = await sendEmailViaEmailJS(emailData);
    
    if (result.success) {
      console.log('Payment confirmation sent via EmailJS successfully');
      return { success: true, messageId: result.messageId, method: 'emailjs' };
    } else {
      console.log('EmailJS failed, but email details are logged');
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('Error sending payment confirmation via EmailJS:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmailViaEmailJS,
  sendPaymentConfirmationViaEmailJS,
  createEmailJSTemplate
};
