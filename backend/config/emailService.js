/**
 * Email Service
 * Handles sending emails using nodemailer
 * Supports dev mode fallback when Gmail credentials are not available
 */

const nodemailer = require("nodemailer");
const {
  orderReadyTemplate,
  orderDeliveredTemplate,
} = require("./emailTemplates");

/**
 * Create Nodemailer transporter with Gmail
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

/**
 * Send Order Ready Notification Email
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's name
 * @param {string} orderId - Order ID
 * @param {object} orderDetails - Order details (garments, totalAmount, estimatedDelivery)
 * @returns {object} - { success: boolean, messageId?: string, error?: string }
 */
const sendOrderReadyEmail = async (
  customerEmail,
  customerName,
  orderId,
  orderDetails,
) => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // ── Dev fallback — no Gmail configured ───────────────
  if (!gmailUser || !gmailPass) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧  DEV MODE — Order Ready Email`);
    console.log(`   To: ${customerEmail}`);
    console.log(`   Customer: ${customerName}`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   (Add GMAIL_USER + GMAIL_APP_PASSWORD in .env)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return { success: true, dev: true, mode: "DEV_MODE" };
  }

  try {
    const transporter = createTransporter();
    const template = orderReadyTemplate(customerName, orderId, orderDetails);

    const mailOptions = {
      from: `"CleanPress Laundry" <${gmailUser}>`,
      to: customerEmail,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `✅ Order Ready Email sent to ${customerEmail} | Order: ${orderId} | Message ID: ${info.messageId}`,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send error for ${orderId}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Order Delivered Notification Email
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's name
 * @param {string} orderId - Order ID
 * @param {Date} actualDeliveryDate - Actual delivery date
 * @returns {object} - { success: boolean, messageId?: string, error?: string }
 */
const sendOrderDeliveredEmail = async (
  customerEmail,
  customerName,
  orderId,
  actualDeliveryDate,
) => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // ── Dev fallback ───────────────
  if (!gmailUser || !gmailPass) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧  DEV MODE — Order Delivered Email`);
    console.log(`   To: ${customerEmail}`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   (Add GMAIL_USER + GMAIL_APP_PASSWORD in .env)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return { success: true, dev: true, mode: "DEV_MODE" };
  }

  try {
    const transporter = createTransporter();
    const template = orderDeliveredTemplate(
      customerName,
      orderId,
      actualDeliveryDate,
    );

    const mailOptions = {
      from: `"CleanPress Laundry" <${gmailUser}>`,
      to: customerEmail,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `✅ Order Delivered Email sent to ${customerEmail} | Order: ${orderId} | Message ID: ${info.messageId}`,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send error for ${orderId}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get customer email by phone number
 * @param {string} phoneNumber - Customer phone number
 * @returns {string|null} - Customer email or null
 */
const getCustomerEmailByPhone = async (phoneNumber) => {
  try {
    const User = require("../models/User");
    const customer = await User.findOne({
      phone: phoneNumber,
      role: "customer",
    }).select("email");
    return customer?.email || null;
  } catch (error) {
    console.error("Error fetching customer email:", error.message);
    return null;
  }
};

module.exports = {
  sendOrderReadyEmail,
  sendOrderDeliveredEmail,
  getCustomerEmailByPhone,
};
