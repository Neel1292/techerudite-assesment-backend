const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

let emailTemplate = fs.readFileSync(path.join(__dirname, "../template/email_template.html"), "utf8");

// Email Transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    service: "gmail",
    port: parseInt(process.env.EMAIL_PORT || 2525),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, code, verifyUrl) => {
    let emailTemplate = fs.readFileSync(path.join(__dirname, "../template/email_template.html"), "utf8");
      
    emailTemplate = emailTemplate
      .replace(/"123456"/g, code) 
      .replace("{{VERIFY_URL}}", `http://localhost:5173/verify?token=${verifyUrl}`);;

    await transporter.sendMail({
      from: process.env.FROM_MAIL,
      to: email,
      subject: "Verify Your Email",
      html: emailTemplate,
    });
};

module.exports = {
    sendVerificationEmail
};