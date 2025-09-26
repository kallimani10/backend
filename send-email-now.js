// Quick script to send email manually for the current user
const { sendPaymentConfirmationEmail } = require('./services/emailService');

const sendEmailNow = async () => {
  const registrationData = {
    name: 'Naresh Kallimani',
    email: 'vaibhavbkalungada@gmail.com',
    course: 'Bootstrap 5 From Scratch',
    courseTitle: 'Bootstrap 5 From Scratch',
    orderId: 'order_1758871202155',
    status: 'confirmed',
    coursePrice: '₹9/-',
    courseDuration: 'N/A'
  };

  try {
    console.log('Sending email to:', registrationData.email);
    const result = await sendPaymentConfirmationEmail(registrationData);
    console.log('Email result:', result);
  } catch (error) {
    console.error('Email failed:', error.message);
  }
};

// Run the script
sendEmailNow();
