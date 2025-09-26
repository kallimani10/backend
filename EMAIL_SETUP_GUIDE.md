# 📧 Email Setup Guide - Multiple Options

## 🚀 Quick Setup (Choose One Option)

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication on your Gmail account**
2. **Generate App Password:**
   - Go to Google Account Settings → Security
   - Under "2-Step Verification" → "App passwords"
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Set Environment Variables:**
   ```bash
   # Create .env file in server directory
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   EMAIL_SERVICE=gmail
   ```

### Option 2: Outlook/Hotmail

1. **Use your Outlook credentials**
2. **Set Environment Variables:**
   ```bash
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASS=your-password
   EMAIL_SERVICE=outlook
   ```

### Option 3: SendGrid (Recommended for Production)

1. **Sign up at [SendGrid](https://sendgrid.com)**
2. **Get API Key from SendGrid Dashboard**
3. **Set Environment Variables:**
   ```bash
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your-sendgrid-api-key
   EMAIL_FROM=your-email@yourdomain.com
   ```

### Option 4: Custom SMTP

1. **Use your hosting provider's SMTP**
2. **Set Environment Variables:**
   ```bash
   EMAIL_SERVICE=custom
   EMAIL_HOST=smtp.your-provider.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@domain.com
   EMAIL_PASS=your-password
   ```

## 🔧 Environment Variables Reference

Create a `.env` file in the `server` directory with these variables:

```bash
# Database
MONGODB_URI=your-mongodb-connection-string

# Server
PORT=5000
CLIENT_ORIGIN=http://localhost:3000

# Payment (Cashfree)
CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key
CASHFREE_API_VERSION=2023-08-01
CASHFREE_BASE=https://sandbox.cashfree.com/pg

# Email Configuration (Choose one option)
EMAIL_SERVICE=gmail  # gmail, outlook, custom, sendgrid

# For Gmail/Outlook/Custom SMTP:
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password

# For Custom SMTP:
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false

# For SendGrid:
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=your-email@yourdomain.com
```

## 🧪 Testing Email Functionality

1. **Set up your email configuration**
2. **Restart the server:**
   ```bash
   cd server
   npm start
   ```
3. **Test by registering for a course**
4. **Check your email for confirmation**

## 🐛 Troubleshooting

### Gmail Issues:
- Make sure 2FA is enabled
- Use App Password, not regular password
- Check if "Less secure app access" is disabled (it should be)

### Outlook Issues:
- Use your regular password
- Make sure IMAP is enabled in Outlook settings

### SendGrid Issues:
- Verify your API key is correct
- Check your SendGrid account status
- Ensure your domain is verified (for production)

### General Issues:
- Check server logs for error messages
- Verify environment variables are set correctly
- Test with a simple email first

## 📊 Email Service Comparison

| Service | Pros | Cons | Best For |
|---------|------|------|----------|
| Gmail | Free, Easy setup | Rate limits, Not for production | Development/Testing |
| Outlook | Free, Reliable | Rate limits | Development/Testing |
| SendGrid | Production ready, High deliverability | Paid service | Production |
| Custom SMTP | Full control | Requires setup | Custom hosting |

## 🚨 Important Notes

1. **Never commit `.env` files to version control**
2. **Use environment variables in production**
3. **Test email functionality before deploying**
4. **Monitor email delivery rates**
5. **Set up proper error handling for email failures**

## 📞 Support

If you're still having issues:
1. Check the server logs for specific error messages
2. Test with a simple email service first
3. Verify your email credentials are correct
4. Consider using SendGrid for production use
