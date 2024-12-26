const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');
require('dotenv').config();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.username.split(' ')[0];
    this.url = url;
    this.from = `Preparation App <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    // 1) Define simple inline HTML
    let html;

    // Define HTML content based on the template
    if (template === 'welcome') {
      html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #007bff;">Hello, ${this.firstName}!</h1>
          <p>Welcome to the Preparation App. We're excited to have you on board!</p>
          <p>Please click the link below to get started:</p>
          <a href="${this.url}" target="_blank" style="color: #007bff; text-decoration: none;">Get Started</a>
          <p>If you have any questions, feel free to reach out to us at any time.</p>
          <p>Best regards,<br>The Preparation App Team</p>
        </div>
      `;
    } else if (template === 'passwordReset') {
      html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #007bff;">Hello, ${this.firstName}!</h1>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <a href="${this.url}" target="_blank" style="color: #007bff; text-decoration: none;">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Best regards,<br>The Preparation App Team</p>
        </div>
      `;
    } else {
      throw new Error('Unknown email template');
    }

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Preparation App!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }
};
