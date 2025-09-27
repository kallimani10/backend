const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const Registration = require('./models/Registration');
const { sendPaymentConfirmation, sendTestEmail } = require('./services/resendEmailService');

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'https://zerokostcourses.netlify.app',
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
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

// Test Resend email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    console.log('Testing Resend email functionality...');
    const result = await sendTestEmail();
    res.json({ 
      message: 'Resend email test completed',
      result: result
    });
  } catch (error) {
    console.error('Resend email test error:', error);
    res.status(500).json({ 
      error: 'Resend email test failed',
      details: error.message
    });
  }
});

// Debug endpoint to check environment variables
app.get('/api/debug-env', (req, res) => {
  const envCheck = {
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
    CASHFREE_APP_ID: process.env.CASHFREE_APP_ID ? 'Set' : 'Missing',
    CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY ? 'Set' : 'Missing',
    CASHFREE_API_VERSION: process.env.CASHFREE_API_VERSION || 'Using default',
    CASHFREE_BASE: process.env.CASHFREE_BASE || 'Using default',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'Using default',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'Using default',
    PORT: process.env.PORT || 'Using default 5000'
  };
  
  res.json({
    message: 'Environment variables check',
    status: envCheck,
    timestamp: new Date().toISOString()
  });
});

// Send payment confirmation email via Resend
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, name, course, orderId } = req.body;
    
    if (!email || !name || !course) {
      return res.status(400).json({ error: 'Email, name, and course are required' });
    }

    console.log('Sending payment confirmation email via Resend to:', email);
    const result = await sendPaymentConfirmation(email, name, course, orderId);
    
    res.json({
      message: 'Resend email sent',
      result: result
    });
  } catch (error) {
    console.error('Resend email error:', error);
    res.status(500).json({
      error: 'Resend email failed',
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
    // Check if required environment variables are set
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error("Missing Cashfree credentials in environment variables");
      return res.status(500).json({ 
        error: "Server configuration error: Missing Cashfree credentials" 
      });
    }

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
        return_url: `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/return?order_id={order_id}`,
        course_data: courseData || {}
      }
    };

    const headers = {
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": process.env.CASHFREE_API_VERSION || '2023-08-01',
      "Content-Type": "application/json"
    };

    // Fix incorrect CASHFREE_BASE URL if it contains 'api.cashfree.com'
    let cashfreeBase = process.env.CASHFREE_BASE || 'https://sandbox.cashfree.com/pg';
    if (cashfreeBase.includes('api.cashfree.com')) {
      cashfreeBase = 'https://sandbox.cashfree.com/pg';
      console.log('Fixed incorrect CASHFREE_BASE URL to:', cashfreeBase);
    }
    
    console.log('Using Cashfree base URL:', cashfreeBase);
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    console.log('Request headers:', JSON.stringify(headers, null, 2));
    
    const resp = await axios.post(`${cashfreeBase}/orders`, payload, { headers });
    res.json({ ...resp.data, order_id: orderId });
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    console.error("Full error:", err);
    res.status(500).json({ 
      error: err.response?.data || err.message,
      details: "Check server logs for more information"
    });
  }
});

// Get order status
app.get('/api/order-status/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    const headers = {
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": process.env.CASHFREE_API_VERSION || '2023-08-01'
    };
    let cashfreeBase = process.env.CASHFREE_BASE || 'https://sandbox.cashfree.com/pg';
    if (cashfreeBase.includes('api.cashfree.com')) {
      cashfreeBase = 'https://sandbox.cashfree.com/pg';
    }
    const resp = await axios.get(`${cashfreeBase}/orders/${order_id}`, { headers });
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
            const emailResult = await sendPaymentConfirmation(
              updatedRegistration.email,
              updatedRegistration.name,
              updatedRegistration.courseTitle || updatedRegistration.course,
              updatedRegistration.orderId
            );
            if (emailResult.success) {
              console.log('Payment confirmation email sent successfully');
            } else {
              console.log('Failed to send payment confirmation email:', emailResult.error);
            }
          } catch (emailError) {
            console.error('Payment confirmation email error:', emailError);
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
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": process.env.CASHFREE_API_VERSION || '2023-08-01'
    };
    
    let cashfreeBase = process.env.CASHFREE_BASE || 'https://sandbox.cashfree.com/pg';
    if (cashfreeBase.includes('api.cashfree.com')) {
      cashfreeBase = 'https://sandbox.cashfree.com/pg';
    }
    const statusResp = await axios.get(`${cashfreeBase}/orders/${orderId}`, { headers });
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
            const emailResult = await sendPaymentConfirmation(
              updatedRegistration.email,
              updatedRegistration.name,
              updatedRegistration.courseTitle || updatedRegistration.course,
              updatedRegistration.orderId
            );
            if (emailResult.success) {
              console.log('Payment confirmation email sent successfully');
            } else {
              console.log('Failed to send payment confirmation email:', emailResult.error);
            }
          } catch (emailError) {
            console.error('Payment confirmation email error:', emailError);
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
