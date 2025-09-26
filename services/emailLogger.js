// Email logging service for manual email sending
const fs = require('fs');
const path = require('path');

// Log email details to file for manual sending
const logEmailForManualSending = (emailData) => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      to: emailData.to,
      subject: emailData.subject,
      from: emailData.from,
      html: emailData.html,
      orderId: emailData.orderId,
      name: emailData.name,
      course: emailData.course
    };

    const logFile = path.join(__dirname, '../logs/email-log.json');
    
    // Create logs directory if it doesn't exist
    const logsDir = path.dirname(logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Read existing logs
    let logs = [];
    if (fs.existsSync(logFile)) {
      const data = fs.readFileSync(logFile, 'utf8');
      logs = JSON.parse(data);
    }

    // Add new log entry
    logs.push(logEntry);

    // Write back to file
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    console.log('Email details logged for manual sending:', {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: logEntry.timestamp
    });

    return true;
  } catch (error) {
    console.error('Error logging email:', error);
    return false;
  }
};

// Get all logged emails
const getLoggedEmails = () => {
  try {
    const logFile = path.join(__dirname, '../logs/email-log.json');
    
    if (!fs.existsSync(logFile)) {
      return [];
    }

    const data = fs.readFileSync(logFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading email logs:', error);
    return [];
  }
};

// Clear email logs
const clearEmailLogs = () => {
  try {
    const logFile = path.join(__dirname, '../logs/email-log.json');
    
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
      console.log('Email logs cleared');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error clearing email logs:', error);
    return false;
  }
};

module.exports = {
  logEmailForManualSending,
  getLoggedEmails,
  clearEmailLogs
};
