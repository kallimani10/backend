# 📧 Gmail Email Setup Guide

## 🎯 **Current Status:**
✅ **Payment System Working Perfectly!**  
✅ **Gmail-Only Configuration Implemented**  
⚠️ **Need to verify Gmail App Password**

## 🔧 **Gmail Setup Steps:**

### **Step 1: Verify Gmail App Password**
The current App Password is: `zwat ekzv fxnj lczy`

**To verify/regenerate:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Click **App passwords**
4. Generate a new password for "Mail"
5. Copy the 16-character password

### **Step 2: Test Gmail Connection**
```bash
# Test Gmail connection
curl https://your-server.com/api/test-gmail
```

### **Step 3: Test Email Sending**
```bash
# Test email functionality
curl https://your-server.com/api/test-email
```

### **Step 4: Send Manual Email**
```bash
# Send confirmation email manually
curl -X POST https://your-server.com/api/send-manual-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vaibhavbkalungada@gmail.com",
    "name": "Naresh Kallimani",
    "course": "JavaScript: Full Understanding",
    "orderId": "order_1758871676199"
  }'
```

## 🚀 **Gmail Configuration Features:**

### **Multiple Gmail Configurations:**
1. **Standard Gmail Service** - Uses Gmail's built-in service
2. **Direct SMTP (Port 587)** - Direct connection to Gmail SMTP
3. **SSL Connection (Port 465)** - Secure SSL connection

### **Optimized Settings:**
- **Connection Timeout**: 15 seconds
- **Greeting Timeout**: 10 seconds
- **Socket Timeout**: 15 seconds
- **TLS**: `rejectUnauthorized: false` for better compatibility
- **Retry Logic**: 3 attempts with increasing delays

### **Retry Mechanism:**
- Attempt 1: Immediate
- Attempt 2: After 2 seconds
- Attempt 3: After 4 seconds
- Attempt 4: After 6 seconds

## 🧪 **Testing Endpoints:**

### **1. Gmail Connection Test:**
```bash
GET /api/test-gmail
```
**Response:**
```json
{
  "message": "Gmail connection successful",
  "status": "connected"
}
```

### **2. Email Functionality Test:**
```bash
GET /api/test-email
```
**Response:**
```json
{
  "message": "Gmail email test completed",
  "result": {
    "success": true,
    "messageId": "email-id"
  }
}
```

### **3. Manual Email Sending:**
```bash
POST /api/send-manual-email
```
**Body:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "course": "Course Name",
  "orderId": "order_123"
}
```

## 🔍 **Troubleshooting:**

### **If Gmail Connection Fails:**
1. **Check App Password**: Ensure it's correct and not expired
2. **Enable 2FA**: Make sure 2-Factor Authentication is enabled
3. **Check Gmail Settings**: Verify "Less secure app access" is disabled
4. **Try Different Ports**: The system tries ports 587 and 465

### **Common Error Messages:**
- **"Invalid login"**: App password is incorrect
- **"Connection timeout"**: Network/firewall blocking SMTP
- **"Authentication failed"**: 2FA not enabled or wrong password

### **Gmail Security Settings:**
1. **2-Factor Authentication**: Must be enabled
2. **App Passwords**: Use 16-character app password, not regular password
3. **Less Secure Apps**: Should be disabled (use App Passwords instead)

## 📊 **Current Configuration:**

```javascript
// Gmail Configuration
EMAIL_USER: 'nareshkallimani09@gmail.com'
EMAIL_PASS: 'zwat ekzv fxnj lczy'  // App Password
```

## 🎯 **Next Steps:**

1. **Test Gmail Connection**: Use `/api/test-gmail` endpoint
2. **Verify App Password**: Check if current password is working
3. **Send Test Email**: Use `/api/test-email` endpoint
4. **Send Manual Email**: Use `/api/send-manual-email` for current user

## 🚀 **Expected Results:**

- ✅ Gmail connection should succeed
- ✅ Email sending should work
- ✅ Payment confirmation emails should be delivered
- ✅ No more connection timeout errors

The system is now optimized for Gmail only with multiple fallback configurations and better retry logic! 🎯
