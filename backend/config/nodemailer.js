import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Standard SMTP transporter (works with any provider: Gmail, Outlook, Zoho,
// Hostinger, cPanel mail, Mailgun SMTP, etc.)
// Required env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
// Optional env: SMTP_SECURE ("true" for port 465), EMAIL_USER (sender address), EMAIL_FROM_NAME
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : SMTP_PORT === 465;
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Lqaly';

const isConfigured = () =>
  Boolean(SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const createTransporter = () => {
  if (!isConfigured()) {
    console.warn('⚠️  SMTP configuration incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS. Emails will fail.');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // true for 465, false for 587/25 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
};

const transporter = createTransporter();

// Helper function to send emails with error handling
export const sendEmail = async (mailOptions) => {
  if (!isConfigured()) {
    throw new Error('SMTP not configured. Cannot send email.');
  }

  const senderEmail = mailOptions.from || process.env.EMAIL_USER || process.env.SMTP_USER;
  const options = {
    ...mailOptions,
    from: senderEmail.includes('<') ? senderEmail : `"${FROM_NAME}" <${senderEmail}>`,
  };

  try {
    const info = await transporter.sendMail(options);
    console.log('✅ Email sent successfully via SMTP:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email via SMTP:', error.message);
    throw error;
  }
};

// Health check function
export const checkEmailHealth = async () => {
  if (!isConfigured()) {
    return { status: 'error', message: 'SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS)' };
  }
  try {
    await transporter.verify();
    return { status: 'healthy', message: `Email service is operational via SMTP (${SMTP_HOST}:${SMTP_PORT})` };
  } catch (error) {
    return { status: 'error', message: `SMTP verification failed: ${error.message}` };
  }
};

export default transporter;