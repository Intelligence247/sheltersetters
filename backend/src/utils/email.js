const nodemailer = require("nodemailer")
const config = require("../config")
const { log, error } = require("./logger")

let transporter

if (config.email.host && config.email.user && config.email.pass) {
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  })
} else {
  log("Email transport is not fully configured. Emails will be logged instead of sent.")
}

const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    log("Email skipped (transport not configured).")
    log({ to, subject, text })
    return
  }

  try {
    await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.from}>`,
      to,
      subject,
      text,
      html,
    })
  } catch (err) {
    error("Failed to send email:", err)
    throw err
  }
}

module.exports = {
  sendEmail,
}

