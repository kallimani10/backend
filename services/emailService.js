const nodemailer = require('nodemailer');

// Email configuration with improved timeout and retry settings
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'zerokosthealthcare@gmail.com',
      pass: process.env.EMAIL_PASS || 'mpkk nuhi npld tgoz'
    },
    connectionTimeout: 30000,  // 30 seconds (reduced from 60)
    greetingTimeout: 15000,    // 15 seconds (reduced from 30)
    socketTimeout: 30000,      // 30 seconds (reduced from 60)
    pool: true,                // Use connection pooling
    maxConnections: 1,         // Limit concurrent connections
    maxMessages: 3,            // Max messages per connection
    rateDelta: 20000,          // Rate limiting
    rateLimit: 5               // Max 5 emails per rateDelta
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

// Email template for registration confirmation
const createRegistrationEmailTemplate = (registrationData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Course Registration Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .course-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-confirmed { background: #d4edda; color: #155724; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 Course Registration Confirmation</h1>
                <p>Thank you for registering with us!</p>
            </div>
            
            <div class="content">
                 <h2>Hello ${registrationData.name || 'Student'}!</h2>
                 
                 <p>We have received your registration for the following course:</p>
                 
                 <div class="course-info">
                     <h3>📚 ${registrationData.courseTitle || registrationData.course || 'Course'}</h3>
                     <p><strong>Duration:</strong> ${registrationData.courseDuration || 'N/A'}</p>
                     <p><strong>Price:</strong> ${registrationData.coursePrice || '₹9/-'}</p>
                     <p><strong>Registration Date:</strong> ${registrationData.registrationDate ? new Date(registrationData.registrationDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                     <p><strong>Status:</strong> 
                         <span class="status-badge ${registrationData.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">
                             ${registrationData.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending Payment'}
                         </span>
                     </p>
                 </div>
                
                ${registrationData.status === 'confirmed' ? 
                    '<p><strong>🎉 Congratulations!</strong> Your payment has been processed successfully and your course registration is confirmed.</p>' :
                    '<p><strong>📝 Next Steps:</strong> Please complete your payment to confirm your registration. You will receive another email once your payment is processed.</p>'
                }
                
                 <h3>📋 Registration Details:</h3>
                 <ul>
                     <li><strong>Name:</strong> ${registrationData.name || 'N/A'}</li>
                     <li><strong>Email:</strong> ${registrationData.email || 'N/A'}</li>
                     <li><strong>Mobile:</strong> ${registrationData.mobile || 'N/A'}</li>
                     <li><strong>Course ID:</strong> ${registrationData.courseId || 'N/A'}</li>
                     ${registrationData.orderId ? `<li><strong>Order ID:</strong> ${registrationData.orderId}</li>` : ''}
                 </ul>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <div class="footer">
                    <p>Best regards,<br>Course Registration Team</p>
                    <p><em>This is an automated email. Please do not reply to this email.</em></p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Retry mechanism for email sending
const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const transporter = createTransporter();
      const result = await transporter.sendMail(mailOptions);
      await transporter.close(); // Close the connection
      return { success: true, messageId: result.messageId };
    } catch (error) {
      lastError = error;
      console.log(`Email send attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Function to send registration confirmation email
const sendRegistrationEmail = async (registrationData) => {
  try {
    // Check if email is properly configured
    const emailUser = process.env.EMAIL_USER || 'zerokosthealthcare@gmail.com';
    const emailPass = process.env.EMAIL_PASS || 'mpkk nuhi npld tgoz';
    
    if (!emailUser || !emailPass || emailPass === 'mpkk nuhi npld tgoz' || emailPass === 'your-16-digit-app-password') {
      console.log('Email not configured - skipping email send');
      console.log('Registration details:', {
        name: registrationData.name,
        email: registrationData.email,
        course: registrationData.courseTitle,
        status: registrationData.status
      });
      return { success: true, messageId: 'email-disabled' };
    }

    const mailOptions = {
      from: emailUser,
      to: registrationData.email,
      subject: `Course Registration Confirmation - ${registrationData.courseTitle}`,
      html: createRegistrationEmailTemplate(registrationData)
    };

    const result = await sendEmailWithRetry(mailOptions);
    console.log('Registration email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending registration email:', error);
    console.log('Registration details logged instead:', {
      name: registrationData.name,
      email: registrationData.email,
      course: registrationData.courseTitle,
      status: registrationData.status
    });
    return { success: false, error: error.message };
  }
};

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = async (registrationData) => {
  try {
    // Check if email is properly configured
    const emailUser = process.env.EMAIL_USER || 'zerokosthealthcare@gmail.com';
    const emailPass = process.env.EMAIL_PASS || 'mpkk nuhi npld tgoz';
    
    if (!emailUser || !emailPass || emailPass === 'mpkk nuhi npld tgoz' || emailPass === 'your-16-digit-app-password') {
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
      from: emailUser,
      to: registrationData.email,
      subject: `Payment Confirmed - ${registrationData.courseTitle}`,
      html: createRegistrationEmailTemplate({ ...registrationData, status: 'confirmed' })
    };

    const result = await sendEmailWithRetry(mailOptions);
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
  sendRegistrationEmail,
  sendPaymentConfirmationEmail
};
