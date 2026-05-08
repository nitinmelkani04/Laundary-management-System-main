


// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// const generateSecureOTP = () => {
//   return crypto.randomInt(100000, 999999).toString();
// };

// // Gmail transporter — use App Password (not your real Gmail password)
// // Setup: Google Account → Security → 2-Step Verification → App Passwords → Generate
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.GMAIL_USER,   // your gmail: abc@gmail.com
//       pass: process.env.GMAIL_APP_PASSWORD, // 16-digit app password from Google
//     },
//   });
// };

// const sendOtpSms = async (emailOrPhone, otp) => {
//   const isDev = process.env.NODE_ENV !== 'production';
//   const gmailUser = process.env.GMAIL_USER;

//   // Dev fallback — no Gmail configured
//   if (!gmailUser) {
//     console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
//     console.log(`📧  DEV MODE — OTP for ${emailOrPhone}: ${otp}`);
//     console.log('   (Set GMAIL_USER and GMAIL_APP_PASSWORD in .env)');
//     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
//     return { success: true, dev: true };
//   }

//   const transporter = createTransporter();

//   const mailOptions = {
//     from: `"CleanPress Laundry" <${gmailUser}>`,
//     to: emailOrPhone,
//     subject: `Your CleanPress OTP: ${otp}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
//         <h2 style="color: #f0c040;">CleanPress 🧺</h2>
//         <p>Your OTP to track your order:</p>
//         <div style="
//           font-size: 36px;
//           font-weight: bold;
//           letter-spacing: 8px;
//           color: #f0c040;
//           background: #1a1a1a;
//           padding: 20px;
//           text-align: center;
//           border-radius: 8px;
//           margin: 20px 0;
//         ">${otp}</div>
//         <p style="color: #888;">Valid for <strong>10 minutes</strong>. Do not share with anyone.</p>
//         <hr style="border-color: #333;" />
//         <p style="color: #555; font-size: 12px;">CleanPress Laundry Management System</p>
//       </div>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP email sent to ${emailOrPhone} | Message ID: ${info.messageId}`);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error('❌ Email send error:', error.message);
//     throw new Error(`Email delivery failed: ${error.message}`);
//   }
// };

// module.exports = { sendOtpSms, generateSecureOTP };






// backend/config/sms.js
// OTP via Email — Nodemailer + Gmail App Password
// npm install nodemailer  ← run this first

const nodemailer = require('nodemailer');

// Gmail transporter — uses App Password (not real Gmail password)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

/**
 * sendOtpSms(email, otp)
 * - Called from auth.js route → customer/send-otp
 * - Sends OTP to customer's email
 * - Dev fallback: prints OTP to terminal if Gmail not configured
 */
const sendOtpSms = async (email, otp) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // ── Dev fallback — no Gmail configured ───────────────
  if (!gmailUser || !gmailPass) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧  DEV MODE — OTP for ${email}: ${otp}`);
    console.log('   (Add GMAIL_USER + GMAIL_APP_PASSWORD in .env)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: true, dev: true };
  }

  // ── Send real OTP email ───────────────────────────────
  const transporter = createTransporter();

  const mailOptions = {
    from: `"CleanPress Laundry" <${gmailUser}>`,
    to: email,
    subject: `${otp} — Your CleanPress OTP`,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 420px;
        margin: 0 auto;
        background: #111;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #2a2a2a;
      ">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f0c040, #d4a010); padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #111; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
            🧺 CleanPress
          </h1>
          <p style="margin: 4px 0 0; color: #333; font-size: 13px;">Laundry Management System</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px;">
          <p style="color: #aaa; font-size: 14px; margin: 0 0 20px;">
            Hello! Your one-time password to track your laundry order:
          </p>

          <!-- OTP Box -->
          <div style="
            background: #1a1a1a;
            border: 2px solid #f0c040;
            border-radius: 10px;
            padding: 24px;
            text-align: center;
            margin: 0 0 24px;
          ">
            <p style="margin: 0 0 8px; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
              Your OTP
            </p>
            <p style="
              margin: 0;
              font-size: 42px;
              font-weight: 900;
              letter-spacing: 12px;
              color: #f0c040;
              font-family: 'Courier New', monospace;
            ">${otp}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin: 0 0 8px;">
            ⏱ Valid for <strong style="color: #aaa;">10 minutes</strong>
          </p>
          <p style="color: #666; font-size: 12px; margin: 0;">
            🔒 Do not share this OTP with anyone.
          </p>
        </div>

        <!-- Footer -->
        <div style="
          background: #0d0d0d;
          padding: 16px 28px;
          border-top: 1px solid #1f1f1f;
        ">
          <p style="margin: 0; color: #444; font-size: 11px; text-align: center;">
            CleanPress Laundry — Automated Email · Do not reply
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email} | Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

const sendStaffCredentialsEmail = async ({ email, loginEmail, name, password }) => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const staffLoginEmail = loginEmail || email;

  if (!gmailUser || !gmailPass) {
    console.log('\nCleanPress staff credentials email');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Login Email: ${staffLoginEmail}`);
    console.log(`Password: ${password}`);
    console.log('Add GMAIL_USER + GMAIL_APP_PASSWORD in .env to send real email.\n');
    return { success: true, dev: true };
  }

  const transporter = createTransporter();
  const loginUrl = process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}/login`
    : '/login';

  const mailOptions = {
    from: `"CleanPress Laundry" <${gmailUser}>`,
    to: email,
    subject: 'Your CleanPress staff account is ready',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #111; color: #eee; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden;">
        <div style="background: #f0c040; color: #111; padding: 22px 26px;">
          <h1 style="margin: 0; font-size: 22px;">CleanPress Staff Access</h1>
        </div>
        <div style="padding: 26px;">
          <p style="margin: 0 0 14px;">Hello ${name},</p>
          <p style="margin: 0 0 20px; color: #bbb;">Your staff account has been approved. Use these credentials to log in:</p>
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px;"><strong>Login Email:</strong> ${staffLoginEmail}</p>
            <p style="margin: 0;"><strong>Password:</strong> <span style="font-family: monospace;">${password}</span></p>
          </div>
          <p style="margin: 0 0 8px; color: #bbb;">Login URL: <a href="${loginUrl}" style="color: #f0c040;">${loginUrl}</a></p>
          <p style="margin: 0; color: #777; font-size: 12px;">Keep this password private.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Staff credentials email sent to ${email} | Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Staff credentials email error:', error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = { sendOtpSms, sendStaffCredentialsEmail };
