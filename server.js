const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');
const Registration = require('./models/Registration');
const { sendPaymentConfirmationEmail } = require('./services/emailService');
const { sendSimpleEmail, testEmail } = require('./services/simpleEmailService');
const { sendSimpleGmailEmail, testGmailEmail } = require('./services/simpleGmailService');
const { sendPaymentConfirmationViaWeb } = require('./services/webEmailService');

const app = express();

// Middleware
app.use(cors({
  origin: [
    config.CLIENT_ORIGIN,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'https://zerokostcourses.netlify.app',
    
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Course Registration API is running!' });
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    console.log('Testing Gmail email functionality...');
    const result = await testEmail();
    res.json({ 
      message: 'Gmail email test completed',
      result: result
    });
  } catch (error) {
    console.error('Gmail email test error:', error);
    res.status(500).json({ 
      error: 'Gmail email test failed',
      details: error.message
    });
  }
});

// Simple Gmail test endpoint
app.get('/api/test-simple-gmail', async (req, res) => {
  try {
    console.log('Testing simple Gmail email...');
    const result = await testGmailEmail();
    res.json({ 
      message: 'Simple Gmail test completed',
      result: result
    });
  } catch (error) {
    console.error('Simple Gmail test error:', error);
    res.status(500).json({ 
      error: 'Simple Gmail test failed',
      details: error.message
    });
  }
});

// Gmail connection test endpoint
app.get('/api/test-gmail', async (req, res) => {
  try {
    console.log('Testing Gmail connection...');
    
    // Test Gmail connection with simple configuration
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zerokosthealthcare@gmail.com',
        pass: 'mpkk nuhi npld tgoz'
      },
      connectionTimeout: 20000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      pool: false,
      maxConnections: 1,
      maxMessages: 1
    });

    console.log('Gmail transporter created, verifying connection...');
    
    // Verify connection
    const verified = await transporter.verify();
    console.log('Gmail connection verified:', verified);
    
    await transporter.close();
    console.log('Gmail connection closed');
    
    res.json({ 
      message: 'Gmail connection successful',
      status: 'connected',
      verified: verified
    });
  } catch (error) {
    console.error('Gmail connection test error:', error);
    res.status(500).json({ 
      error: 'Gmail connection failed',
      details: error.message,
      code: error.code
    });
  }
});

// Manual email sending endpoint for testing
app.post('/api/send-manual-email', async (req, res) => {
  try {
    const { email, name, course, orderId } = req.body;
    
    if (!email || !name || !course) {
      return res.status(400).json({ error: 'Email, name, and course are required' });
    }

    const registrationData = {
      name,
      email,
      course,
      courseTitle: course,
      orderId: orderId || 'manual-test',
      status: 'confirmed',
      coursePrice: '₹9/-',
      courseDuration: 'N/A'
    };

    console.log('Sending manual email to:', email);
    const result = await sendPaymentConfirmationEmail(registrationData);
    
    res.json({
      message: 'Manual email sent',
      result: result
    });
  } catch (error) {
    console.error('Manual email error:', error);
    res.status(500).json({
      error: 'Manual email failed',
      details: error.message
    });
  }
});

// Simple manual email endpoint using simple Gmail service
app.post('/api/send-simple-email', async (req, res) => {
  try {
    const { email, name, course, orderId } = req.body;
    
    if (!email || !name || !course) {
      return res.status(400).json({ error: 'Email, name, and course are required' });
    }

    const subject = `🎉 Payment Confirmed - ${course}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Payment Confirmed</title>
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
                  <div class="success-icon">🎉</div>
                  <h1>Payment Confirmed!</h1>
                  <p>Your course registration is complete</p>
              </div>
              <div class="content">
                  <h2>Hello ${name}!</h2>
                  <p><strong>🎉 Congratulations!</strong> Your payment has been processed successfully.</p>
                  
                  <h3>📚 Course Details:</h3>
                  <p><strong>Course:</strong> ${course}</p>
                  <p><strong>Price Paid:</strong> ₹9/-</p>
                  <p><strong>Order ID:</strong> ${orderId || 'N/A'}</p>
                  <p><strong>Status:</strong> ✅ Payment Confirmed</p>
                  
                  <p>Thank you for choosing our course! You will receive course access details soon.</p>
                  
                  <p><strong>Best regards,<br>Course Registration Team</strong></p>
              </div>
          </div>
      </body>
      </html>
    `;

    console.log('Sending simple email to:', email);
    const result = await sendSimpleGmailEmail(email, subject, html);
    
    res.json({
      message: 'Simple email sent',
      result: result
    });
  } catch (error) {
    console.error('Simple email error:', error);
    res.status(500).json({
      error: 'Simple email failed',
      details: error.message
    });
  }
});

// Web service email endpoint (works around SMTP blocking)
app.post('/api/send-web-email', async (req, res) => {
  try {
    const { email, name, course, orderId } = req.body;
    
    if (!email || !name || !course) {
      return res.status(400).json({ error: 'Email, name, and course are required' });
    }

    const registrationData = {
      name,
      email,
      course,
      courseTitle: course,
      orderId: orderId || 'web-test',
      status: 'confirmed',
      coursePrice: '₹9/-',
      courseDuration: 'N/A'
    };

    console.log('Sending web email to:', email);
    const result = await sendPaymentConfirmationViaWeb(registrationData);
    
    res.json({
      message: 'Web email sent',
      result: result
    });
  } catch (error) {
    console.error('Web email error:', error);
    res.status(500).json({
      error: 'Web email failed',
      details: error.message
    });
  }
});

// Submit registration form
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, mobile, course, courseId, courseTitle, coursePrice, courseDuration, orderId } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !course) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Create new registration
    const registration = new Registration({
      name,
      email,
      mobile,
      course,
      courseId: courseId || null,
      courseTitle: courseTitle || course,
      coursePrice: coursePrice || '₹9/-',
      courseDuration: courseDuration || 'N/A',
      orderId: orderId || null
    });

    // Save to database
    const savedRegistration = await registration.save();

    // Note: Email will be sent only after successful payment
    console.log('Registration saved successfully. Email will be sent after payment confirmation.');

    res.status(201).json({
      message: 'Registration submitted successfully!',
      data: savedRegistration
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get all registrations (for admin purposes)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (error) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Create Cashfree payment order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, email, phone, courseData } = req.body;

    const orderId = "order_" + Date.now();

    const payload = {
      order_id: orderId,
      order_amount: Number(amount || 9),
      order_currency: "INR",
      customer_details: {
        customer_id: "cust_" + Date.now(),
        customer_email: email || "test@cashfree.com",
        customer_phone: phone || "9999999999"
      },
      order_meta: {
        return_url: `${config.CLIENT_ORIGIN}/return?order_id={order_id}`,
        course_data: courseData || {}
      }
    };

    const headers = {
      "x-client-id": config.CASHFREE_APP_ID,
      "x-client-secret": config.CASHFREE_SECRET_KEY,
      "x-api-version": config.CASHFREE_API_VERSION,
      "Content-Type": "application/json"
    };

    const resp = await axios.post(`${config.CASHFREE_BASE}/orders`, payload, { headers });
    res.json({ ...resp.data, order_id: orderId });
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get order status
app.get('/api/order-status/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    const headers = {
      "x-client-id": config.CASHFREE_APP_ID,
      "x-client-secret": config.CASHFREE_SECRET_KEY,
      "x-api-version": config.CASHFREE_API_VERSION
    };
    const resp = await axios.get(`${config.CASHFREE_BASE}/orders/${order_id}`, { headers });
    res.json(resp.data);
  } catch (err) {
    console.error("Get order error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Webhook for payment status updates
app.post('/api/webhook/cashfree', async (req, res) => {
  try {
    console.log("Webhook received:", req.headers, req.body);
    
    const { order_id, order_status } = req.body;
    
    if (order_status === 'PAID') {
      // Update registration status in MongoDB
      const updatedRegistration = await Registration.findOneAndUpdate(
        { orderId: order_id },
        { status: 'confirmed' },
        { new: true }
      );
      console.log(`Order ${order_id} marked as confirmed for registration:`, updatedRegistration?._id);
      
      // Send payment confirmation email (non-blocking)
      if (updatedRegistration) {
        setImmediate(async () => {
          try {
            const emailResult = await sendPaymentConfirmationEmail(updatedRegistration);
            if (emailResult.success) {
              console.log('Payment confirmation email sent successfully');
            } else {
              console.log('Failed to send payment confirmation email:', emailResult.error);
              // Log the details for manual follow-up if needed
              console.log('Payment confirmation details logged instead:', {
                name: updatedRegistration.name,
                email: updatedRegistration.email,
                course: updatedRegistration.courseTitle,
                status: 'confirmed',
                orderId: updatedRegistration.orderId
              });
            }
          } catch (emailError) {
            console.error('Payment confirmation email error:', emailError);
            // Log the details for manual follow-up if needed
            console.log('Payment confirmation details logged instead:', {
              name: updatedRegistration.name,
              email: updatedRegistration.email,
              course: updatedRegistration.courseTitle,
              status: 'confirmed',
              orderId: updatedRegistration.orderId
            });
          }
        });
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Manual status check endpoint
app.post('/api/check-payment-status', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    console.log(`Checking payment status for order: ${orderId}`);

    // Check payment status from Cashfree
    const headers = {
      "x-client-id": config.CASHFREE_APP_ID,
      "x-client-secret": config.CASHFREE_SECRET_KEY,
      "x-api-version": config.CASHFREE_API_VERSION
    };
    
    const statusResp = await axios.get(`${config.CASHFREE_BASE}/orders/${orderId}`, { headers });
    const orderStatus = statusResp.data?.order_status;
    
    console.log(`Order ${orderId} status: ${orderStatus}`);
    
    // Update registration status if payment is successful
    if (orderStatus === 'PAID') {
      const updatedRegistration = await Registration.findOneAndUpdate(
        { orderId: orderId },
        { status: 'confirmed' },
        { new: true }
      );
      
      console.log(`Updated registration status for order ${orderId}:`, updatedRegistration ? 'SUCCESS' : 'NOT FOUND');
      
      // Send payment confirmation email (non-blocking)
      if (updatedRegistration) {
        setImmediate(async () => {
          try {
            const emailResult = await sendPaymentConfirmationEmail(updatedRegistration);
            if (emailResult.success) {
              console.log('Payment confirmation email sent successfully');
            } else {
              console.log('Failed to send payment confirmation email:', emailResult.error);
              // Log the details for manual follow-up if needed
              console.log('Payment confirmation details logged instead:', {
                name: updatedRegistration.name,
                email: updatedRegistration.email,
                course: updatedRegistration.courseTitle,
                status: 'confirmed',
                orderId: updatedRegistration.orderId
              });
            }
          } catch (emailError) {
            console.error('Payment confirmation email error:', emailError);
            // Log the details for manual follow-up if needed
            console.log('Payment confirmation details logged instead:', {
              name: updatedRegistration.name,
              email: updatedRegistration.email,
              course: updatedRegistration.courseTitle,
              status: 'confirmed',
              orderId: updatedRegistration.orderId
            });
          }
        });
      }
    }
    
    res.json({ 
      order_status: orderStatus,
      message: orderStatus === 'PAID' ? 'Payment confirmed and registration updated' : 'Payment status checked'
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Manual update registration status endpoint
app.post('/api/update-registration-status', async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Order ID and status are required' });
    }

    const updatedRegistration = await Registration.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true }
    );

    if (updatedRegistration) {
      console.log(`Manually updated registration status for order ${orderId} to ${status}`);
      res.json({ 
        success: true, 
        message: 'Registration status updated successfully',
        registration: updatedRegistration
      });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
    
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update registration status' });
  }
});

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
