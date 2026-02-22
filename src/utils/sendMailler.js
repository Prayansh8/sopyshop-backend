var nodemailer = require("nodemailer");
const { config } = require("../config");

const sendMailler = (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.mailer.userMail,
      pass: config.mailer.passwordMail,
    },
  });

  var mailOptions = {
    from: config.mailer.userMail,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendMailler };
