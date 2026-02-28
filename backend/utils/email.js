// utils/email.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};




// Generate password reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request - Virtual Notice Board',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Virtual Notice Board</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.name},</h2>

            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your Virtual Notice Board account.
              Click the button below to reset your password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white; padding: 15px 30px; text-decoration: none;
                        border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all; color: #667eea;">${resetUrl}</span>
            </p>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message from Virtual Notice Board. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send password reset confirmation email
const sendPasswordResetConfirmationEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Successful - Virtual Notice Board',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Virtual Notice Board</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Successful</p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.name},</h2>

            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your password has been successfully reset for your Virtual Notice Board account.
            </p>

            <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #155724; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't perform this action, please contact our support team immediately.
              </p>
            </div>

            <p style="color: #666; line-height: 1.6;">
              You can now log in to your account with your new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login"
                 style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                        color: white; padding: 15px 30px; text-decoration: none;
                        border-radius: 5px; font-weight: bold; display: inline-block;">
                Go to Login
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message from Virtual Notice Board. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset confirmation email:', error);
    throw error;
  }
};

export {
  createTransporter,
  generateResetToken,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
};
