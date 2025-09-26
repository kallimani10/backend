const nodemailer = require('nodemailer');
const config = require('../config');

// Email configuration with support for multiple providers
const createTransporter = () => {
  const emailService = config.EMAIL_SERVICE || 'gmail';
  
  // Check if email is configured
  if (!config.EMAIL_USER || !config.EMAIL_PASS) {
    throw new Error('Email not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  let transporterConfig;

  switch (emailService.toLowerCase()) {
    case 'gmail':
      transporterConfig = {
        service: 'gmail',
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS
        },
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
        pool: true,
        maxConnections: 1,
        maxMessages: 3,
        rateDelta: 20000,
        rateLimit: 5
      };
      break;

    case 'outlook':
    case 'hotmail':
      transporterConfig = {
        service: 'hotmail',
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS
        },
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000
      };
      break;

    case 'custom':
      transporterConfig = {
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: config.EMAIL_SECURE,
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS
        },
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000
      };
      break;

    case 'sendgrid':
      // SendGrid uses different configuration
      return createSendGridTransporter();

    default:
      throw new Error(`Unsupported email service: ${emailService}`);
  }

  return nodemailer.createTransport(transporterConfig);
};

// SendGrid transporter (production-ready)
const createSendGridTransporter = () => {
  if (!config.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key not configured');
  }
  
  return nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: config.SENDGRID_API_KEY
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
};

// Alternative Gmail configuration (if you want to try Gmail again)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER || 'zerokosthealthcare@gmail.com',
//     pass: process.env.EMAIL_PASS || 'mpkk nuhi npld tgoz'
//   }
// });

// Alternative: If Gmail doesn't work, you can use this configuration for other services
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER || 'zerokosthealthcare@gmail.com',
//     pass: process.env.EMAIL_PASS || 'your-16-digit-app-password'
//   }
// });

// Enhanced email template for payment confirmation
const createPaymentConfirmationEmailTemplate = (registrationData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Confirmed - Course Registration</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .course-info { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .payment-info { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #28a745; }
            .status-badge { display: inline-block; padding: 8px 20px; border-radius: 25px; font-weight: bold; font-size: 16px; }
            .status-confirmed { background: #d4edda; color: #155724; border: 2px solid #28a745; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .details-table td { padding: 10px; border-bottom: 1px solid #ddd; }
            .details-table td:first-child { font-weight: bold; width: 30%; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
            .next-steps { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">🎉</div>
                <h1>Payment Confirmed!</h1>
                <p>Your course registration is now complete</p>
            </div>
            
            <div class="content">
                <h2>Hello ${registrationData.name || 'Student'}!</h2>
                
                <p><strong>🎉 Congratulations!</strong> Your payment has been processed successfully and your course registration is confirmed.</p>
                
                <div class="course-info">
                    <h3>📚 Course Details</h3>
                    <table class="details-table">
                        <tr><td>Course Name:</td><td>${registrationData.courseTitle || registrationData.course || 'N/A'}</td></tr>
                        <tr><td>Duration:</td><td>${registrationData.courseDuration || 'N/A'}</td></tr>
                        <tr><td>Price Paid:</td><td>${registrationData.coursePrice || '₹9/-'}</td></tr>
                        <tr><td>Registration Date:</td><td>${registrationData.registrationDate ? new Date(registrationData.registrationDate).toLocaleDateString() : new Date().toLocaleDateString()}</td></tr>
                        <tr><td>Payment Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
                        <tr><td>Status:</td><td><span class="status-badge status-confirmed">✅ Payment Confirmed</span></td></tr>
                    </table>
                </div>
                
                <div class="payment-info">
                    <h3>💳 Payment Information</h3>
                    <table class="details-table">
                        <tr><td>Order ID:</td><td>${registrationData.orderId || 'N/A'}</td></tr>
                        <tr><td>Payment Status:</td><td>✅ Successfully Processed</td></tr>
                        <tr><td>Amount Paid:</td><td>${registrationData.coursePrice || '₹9/-'}</td></tr>
                        <tr><td>Payment Method:</td><td>Online Payment (Cashfree)</td></tr>
                    </table>
                </div>
                
                <div class="next-steps">
                    <h3>📋 What's Next?</h3>
                    <ul>
                        <li>You will receive course access details within 24 hours</li>
                        <li>Check your email for any additional course materials</li>
                        <li>Join our community for course updates and support</li>
                        <li>If you have any questions, contact our support team</li>
                    </ul>
                </div>
                
                <h3>👤 Registration Details</h3>
                <table class="details-table">
                    <tr><td>Full Name:</td><td>${registrationData.name || 'N/A'}</td></tr>
                    <tr><td>Email Address:</td><td>${registrationData.email || 'N/A'}</td></tr>
                    <tr><td>Mobile Number:</td><td>${registrationData.mobile || 'N/A'}</td></tr>
                    <tr><td>Course ID:</td><td>${registrationData.courseId || 'N/A'}</td></tr>
                </table>
                
                <p><strong>Thank you for choosing our course!</strong> We're excited to have you as a student and look forward to your success.</p>
                
                <div class="footer">
                    <p><strong>Best regards,<br>Course Registration Team</strong></p>
                    <p><em>This is an automated confirmation email. Please save this email for your records.</em></p>
                    <p>For support, please contact us at: support@yourdomain.com</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Gmail-only email sending with optimized configuration
const sendEmailWithFallback = async (mailOptions, maxRetries = 3) => {
  console.log('Attempting to send email using Gmail...');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Gmail attempt ${attempt}/${maxRetries}`);
      const transporter = createOptimizedGmailTransporter();
      const result = await transporter.sendMail(mailOptions);
      await transporter.close();
      console.log(`Email sent successfully using Gmail (attempt ${attempt})`);
      return { success: true, messageId: result.messageId, service: 'gmail' };
    } catch (error) {
      console.log(`Gmail attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // 2s, 4s, 6s delays
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

// Optimized Gmail transporter with multiple configuration options
const createOptimizedGmailTransporter = () => {
  if (!config.EMAIL_USER || !config.EMAIL_PASS) {
    throw new Error('Gmail not configured. Please set EMAIL_USER and EMAIL_PASS');
  }

  // Try different Gmail configurations for better compatibility
  const gmailConfigs = [
    // Configuration 1: Standard Gmail service
    {
      service: 'gmail',
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      },
      connectionTimeout: 15000,  // 15 seconds
      greetingTimeout: 10000,    // 10 seconds
      socketTimeout: 15000,      // 15 seconds
      pool: false,
      maxConnections: 1,
      maxMessages: 1,
      tls: {
        rejectUnauthorized: false
      }
    },
    // Configuration 2: Direct SMTP with Gmail
    {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false
      }
    },
    // Configuration 3: Gmail with SSL
    {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false
      }
    }
  ];

  // Try each configuration until one works
  for (let i = 0; i < gmailConfigs.length; i++) {
    try {
      console.log(`Trying Gmail configuration ${i + 1}`);
      const transporter = nodemailer.createTransport(gmailConfigs[i]);
      return transporter;
    } catch (error) {
      console.log(`Gmail configuration ${i + 1} failed:`, error.message);
      if (i === gmailConfigs.length - 1) {
        throw error;
      }
    }
  }
};

// Note: Registration emails are no longer sent immediately
// Emails are only sent after successful payment confirmation

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = async (registrationData) => {
  try {
    // Check if email is properly configured
    if (!config.EMAIL_USER || !config.EMAIL_PASS) {
      console.log('Email not configured - skipping payment confirmation email');
      console.log('Payment confirmation details:', {
        name: registrationData.name,
        email: registrationData.email,
        course: registrationData.courseTitle,
        status: 'confirmed',
        orderId: registrationData.orderId
      });
      return { success: true, messageId: 'email-disabled' };
    }

    const mailOptions = {
      from: config.EMAIL_FROM || config.EMAIL_USER,
      to: registrationData.email,
      subject: `🎉 Payment Confirmed - ${registrationData.courseTitle || registrationData.course}`,
      html: createPaymentConfirmationEmailTemplate(registrationData)
    };

    const result = await sendEmailWithFallback(mailOptions);
    console.log('Payment confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    console.log('Payment confirmation details logged instead:', {
      name: registrationData.name,
      email: registrationData.email,
      course: registrationData.courseTitle,
      status: 'confirmed',
      orderId: registrationData.orderId
    });
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPaymentConfirmationEmail
};
