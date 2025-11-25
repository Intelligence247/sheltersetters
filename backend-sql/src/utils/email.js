const nodemailer = require("nodemailer")
const config = require("../config")
const { log, error } = require("./logger")

let transporter

if (config.email.host && config.email.user && config.email.pass) {
  // For Gmail, use service instead of host/port for better reliability
  const isGmail = config.email.host.includes("gmail.com") || config.email.user.includes("@gmail.com")
  
  // Determine secure mode based on port and config
  // Port 465 = direct SSL/TLS (secure: true)
  // Port 587 = STARTTLS (secure: false, requiresUpgrade: true)
  const port = config.email.port || 587
  const isSecurePort = port === 465
  const useSecure = config.email.secure !== undefined ? config.email.secure : isSecurePort
  
  const transportOptions = isGmail
    ? {
        service: "gmail",
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
        // Timeout options for Gmail
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      }
    : {
        host: config.email.host,
        port: port,
        secure: useSecure, // true for 465, false for 587 (STARTTLS)
        requireTLS: !useSecure && port === 587, // Require TLS upgrade for STARTTLS
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
        // Connection timeout options
        connectionTimeout: 15000, // 15 seconds
        greetingTimeout: 15000, // 15 seconds
        socketTimeout: 15000, // 15 seconds
        // TLS options
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates if needed
        },
        // Pool connections for better reliability
        pool: false, // Disable pooling to avoid connection issues
        debug: config.env === "development", // Enable debug in development
        logger: config.env === "development", // Enable logger in development
      }

  transporter = nodemailer.createTransport(transportOptions)
  
  const secureMode = useSecure ? "SSL/TLS" : "STARTTLS"
  log(`Email transport configured: ${isGmail ? "Gmail" : config.email.host}:${port} (${secureMode})`)
  
  // Verify connection on startup (non-blocking)
  setImmediate(() => {
    transporter.verify((err, success) => {
      if (err) {
        error("Email transport verification failed:", err.message)
        error("This might be due to network/firewall issues. Email will still attempt to send.")
      } else {
        log("Email transport verified and ready")
      }
    })
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

  const fromAddress = config.email.from || config.email.user || "no-reply@sheltersetters.com"
  const fromName = config.email.fromName || "Shelter Setters"

  try {
    // Send email with timeout protection
    const sendPromise = transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    })
    
    // Add a longer timeout for actual send (connection timeouts are handled by transporter)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Email send operation timed out after 30 seconds")), 30000)
    })
    
    const result = await Promise.race([sendPromise, timeoutPromise])
    log(`Email sent successfully to ${to} (MessageId: ${result.messageId || "N/A"})`)
    return result
  } catch (err) {
    const errorMessage = err.message || String(err)
    error("Failed to send email:", errorMessage)
    // Re-throw with more context
    const enhancedError = new Error(`Email delivery failed: ${errorMessage}`)
    enhancedError.originalError = err
    throw enhancedError
  }
}

module.exports = {
  sendEmail,
}
