# Email Configuration Setup

This document explains how to configure the email functionality for the forgot password feature.

## Prerequisites

The email functionality uses **Nodemailer** which is already included in the project dependencies.

## Environment Variables

Add the following environment variables to your `.env` file in the backend directory:

```env
# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Gmail Setup (Recommended)

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication

### 2. Generate App Password
- Go to Google Account settings → Security
- Click on "App passwords"
- Select "Mail" for the app and "Other (Custom name)" for the device
- Enter "Virtual Notice Board" as the custom name
- Copy the generated 16-character password

### 3. Update Environment Variables
- Use your Gmail address for `EMAIL_USER`
- Use the 16-character app password for `EMAIL_PASS`

## Alternative Email Providers

You can use other email providers by updating the configuration:

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

## Security Notes

- **Never** commit your `.env` file to version control
- Use app-specific passwords, not your main email password
- The email configuration works with both development and production environments
- Password reset tokens expire after 1 hour for security

## Testing

To test the email functionality:

1. Start the backend server
2. Go to the login page and click "Forgot your password?"
3. Enter a registered email address
4. Check your email inbox for the reset link
5. Click the link to reset your password

## Troubleshooting

### Common Issues

1. **Authentication failed**: Ensure you're using an app password (for Gmail) and not your regular password
2. **Connection timeout**: Check that the SMTP host and port are correct
3. **Email not received**: Check spam/junk folders
4. **Invalid credentials**: Verify email address and password are correct

### Debug Mode

For debugging, you can temporarily enable debug logging by adding this to your email utility:

```javascript
const transporter = createTransporter();
transporter.verify().then(console.log).catch(console.error);
```

## Features Implemented

- ✅ Forgot password email with reset link
- ✅ Password reset confirmation email
- ✅ Secure token generation (1-hour expiry)
- ✅ Email validation
- ✅ Error handling and user feedback
- ✅ Beautiful email templates with responsive design

## Email Templates

The system includes professionally designed email templates with:
- Company branding
- Clear call-to-action buttons
- Security notices
- Responsive design for mobile devices
- Fallback links for email clients that disable buttons
