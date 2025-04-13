const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // Set up your email transport (e.g., Gmail or SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"LoopIn Admin" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
