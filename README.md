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

#### **Get Logged Emails (for manual sending):**
```bash
GET /api/logged-emails
```

#### **Clear Logged Emails:**
```bash
DELETE /api/logged-emails
```

### **Features:**
- ✅ Gmail-only email sending
- ✅ Professional HTML email templates
- ✅ Payment confirmation emails
- ✅ Email logging for manual sending (when SMTP blocked)
- ✅ Clean, simple code
- ✅ No unnecessary files

### **How It Works:**
1. User registers and pays
2. Payment is confirmed
3. System tries to send Gmail confirmation email
4. If Gmail fails (SMTP blocked), email details are logged
5. You can view logged emails and send them manually
6. User receives professional email

### **When SMTP is Blocked:**
- Email details are automatically logged to `logs/email-log.json`
- Use `GET /api/logged-emails` to view all logged emails
- Copy the email details and send manually via Gmail web interface
- Use `DELETE /api/logged-emails` to clear the logs

**Simple and clean! 🚀**