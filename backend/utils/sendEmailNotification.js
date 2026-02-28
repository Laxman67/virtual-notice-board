import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email Helper
const sendEmailNotification = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from:
        process.env.EMAIL_USER || 'Business Messenger <noreply@messenger.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email error:', error);
  }
};

export default sendEmailNotification;
