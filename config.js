require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000,
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY,
  CASHFREE_API_VERSION: process.env.CASHFREE_API_VERSION,
  CASHFREE_BASE: process.env.CASHFREE_BASE,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  
  // Email Configuration - Gmail Only
  EMAIL_USER: process.env.EMAIL_USER ,
  EMAIL_PASS: process.env.EMAIL_PASS ,
  
  // Alternative Email Services
  EMAIL_HOST: process.env.EMAIL_HOST || null,
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true' || false,
  
  // SendGrid Configuration
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || null,
  EMAIL_FROM: process.env.EMAIL_FROM || null,
  
  // Email Service Selection
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail' // gmail, outlook, custom, sendgrid
};
