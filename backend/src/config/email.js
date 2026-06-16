const nodemailer = require("nodemailer");
const logger = require("./logger");

let transporter = null;

const initializeEmailService = () => {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    logger.info("Email service initialized");
    return transporter;
  } catch (error) {
    logger.error("Failed to initialize email service:", error);
    throw error;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!transporter) {
      initializeEmailService();
    }

    const result = await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent to ${to}`);
    return result;
  } catch (error) {
    logger.error("Failed to send email:", error);
    throw error;
  }
};

const sendVerificationEmail = async (email, verificationLink) => {
  const html = `
    <h2>Verify Your Email</h2>
    <p>Click the link below to verify your email address:</p>
    <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Verify Email
    </a>
    <p>This link will expire in 24 hours.</p>
  `;

  return sendEmail(email, "Verify Your Email - Cloud Storage Platform", html);
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const html = `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Reset Password
    </a>
    <p>This link will expire in 1 hour.</p>
  `;

  return sendEmail(email, "Reset Your Password - Cloud Storage Platform", html);
};

const sendWelcomeEmail = async (email, firstName) => {
  const html = `
    <h2>Welcome to Cloud Storage Platform!</h2>
    <p>Hi ${firstName},</p>
    <p>Your account has been successfully created. You now have 5GB of free storage.</p>
    <p>Get started by uploading your first file!</p>
  `;

  return sendEmail(email, "Welcome to Cloud Storage Platform", html);
};

const sendFileSharedEmail = async (email, fileName, sharedBy) => {
  const html = `
    <h2>${fileName} has been shared with you</h2>
    <p>${sharedBy} has shared "${fileName}" with you on Cloud Storage Platform.</p>
    <a href="${process.env.APP_URL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
      View File
    </a>
  `;

  return sendEmail(email, `${fileName} has been shared with you`, html);
};

module.exports = {
  initializeEmailService,
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendFileSharedEmail,
};
