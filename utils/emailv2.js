const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
require('dotenv').config();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.from = `Preparation App <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
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

  async send(purpose, subject) {
    // 1) Render HTML
    let html;
    if (purpose === 'welcome') {
      html = '<h1>You successfully signed up in the Preparation app.</h1>';
    } else if (purpose === 'reset') {
      html = `
      <h1>Preparation App Password Resetting</h1>
      <p>You requested password reset</p>
      <p>Click this <a href=${
        process.env.NODE_ENV === 'development'
          ? `http://localhost:5173/reset-password/${token}`
          : `https://preparation-app.onrender.com/reset/${token}`
      }>link</a> to set a new password</p>
      `;
    }

    // 2) Define email options
    const mailOptions = {
      from: 'Melnard De Jesus <dejesusmelnard@gmail.com>',
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Preparation App');
  }
};
