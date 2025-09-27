require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://admin123:WHDwvBqNBUVwQcqn@cluster0.7ttpes6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  PORT: process.env.PORT || 5000,
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || 'TEST10783812f10718d0b666328656b221838701',
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_test_055a585aa73adc293efd874e702cd10c_23aa53e9',
  CASHFREE_API_VERSION: process.env.CASHFREE_API_VERSION || '2023-08-01',
  CASHFREE_BASE: process.env.CASHFREE_BASE || 'https://sandbox.cashfree.com/pg',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  
  // Email Configuration - Gmail Only
  EMAIL_USER: process.env.EMAIL_USER || 'nareshkallimani09@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'zwat ekzv fxnj lczy',
  
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
