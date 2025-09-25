# Email Configuration Guide

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Factor Authentication

### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click "App passwords"
4. Generate a new app password for "Mail"
5. Copy the generated password

### Step 3: Update Configuration
Update the `server/config.js` file with your email credentials:

```javascript
module.exports = {
  // ... other config
  EMAIL_USER: 'your-email@gmail.com',     // Your Gmail address
  EMAIL_PASS: 'your-16-digit-app-password' // Your Gmail App Password
};
```

## Alternative Email Services

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password'
  }
});
```

## Testing Email Functionality

1. Update your email credentials in `config.js`
2. Restart the server
3. Register for a course
4. Check your email for confirmation

## Email Templates

The system sends two types of emails:
1. **Registration Confirmation**: Sent immediately after registration
2. **Payment Confirmation**: Sent after successful payment

Both emails include:
- Course details
- Registration information
- Payment status
- Professional HTML formatting
