# 🎯 Clean Gmail Email System

## 📧 **Simple Gmail-Only Email Service**

This is a clean, simple email system that uses only Gmail for sending emails.

### **Files:**
- `services/gmailService.js` - Clean Gmail email service
- `server.js` - Clean server with essential endpoints only

### **Gmail Configuration:**
- **Email**: `zerokosthealthcare@gmail.com`
- **App Password**: `mpkk nuhi npld tgoz`

### **Endpoints:**

#### **Test Email:**
```bash
GET /api/test-email
```

#### **Send Payment Confirmation:**
```bash
POST /api/send-email
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "course": "Course Name",
  "orderId": "order_123"
}
```

### **Features:**
- ✅ Gmail-only email sending
- ✅ Professional HTML email templates
- ✅ Payment confirmation emails
- ✅ Clean, simple code
- ✅ No unnecessary files

### **How It Works:**
1. User registers and pays
2. Payment is confirmed
3. Gmail sends confirmation email
4. User receives professional email

**Simple and clean! 🚀**