/**
 * Email Templates for CleanPress Laundry System
 * Templates for various notification emails
 */

/**
 * Order Ready Notification Template
 * Sent when order status changes to READY
 */
const orderReadyTemplate = (customerName, orderId, orderDetails) => {
  const garmentsList = orderDetails.garments
    .map(
      (g) =>
        `<li style="margin: 8px 0; color: #bbb;">${g.quantity}x ${g.type} — ₹${g.subtotal}</li>`,
    )
    .join("");

  const totalAmount = orderDetails.totalAmount;
  const estimatedDelivery = new Date(
    orderDetails.estimatedDelivery,
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: `🎉 Your Order ${orderId} is Ready for Pickup!`,
    html: `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 520px;
        margin: 0 auto;
        background: #0f0f0f;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid #2a2a2a;
      ">
        <!-- Header Banner -->
        <div style="
          background: linear-gradient(135deg, #f0c040, #d4a010);
          padding: 28px;
          text-align: center;
        ">
          <h1 style="
            margin: 0;
            color: #111;
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.5px;
          ">
            🧺 CleanPress
          </h1>
          <p style="
            margin: 6px 0 0;
            color: #333;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">
            Laundry Management System
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 32px 28px;">
          <!-- Greeting -->
          <p style="
            margin: 0 0 24px;
            color: #fff;
            font-size: 18px;
            font-weight: 600;
          ">
            Hi ${customerName}! 👋
          </p>

          <!-- Status Update -->
          <div style="
            background: linear-gradient(135deg, rgba(240, 192, 64, 0.1), rgba(212, 160, 16, 0.05));
            border-left: 4px solid #f0c040;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 24px;
          ">
            <p style="
              margin: 0;
              color: #f0c040;
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              ✅ Order Ready for Pickup
            </p>
            <p style="
              margin: 8px 0 0;
              color: #aaa;
              font-size: 13px;
              line-height: 1.5;
            ">
              Great news! Your laundry has been cleaned and is ready for pickup.
            </p>
          </div>

          <!-- Order Details -->
          <div style="
            background: #1a1a1a;
            padding: 18px;
            border-radius: 8px;
            margin-bottom: 24px;
            border: 1px solid #2a2a2a;
          ">
            <h3 style="
              margin: 0 0 16px;
              color: #f0c040;
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              📦 Order Details
            </h3>

            <!-- Order ID -->
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #2a2a2a;
              margin-bottom: 10px;
            ">
              <span style="color: #888; font-size: 13px;">Order ID:</span>
              <span style="color: #f0c040; font-size: 13px; font-weight: 600;">${orderId}</span>
            </div>

            <!-- Garments List -->
            <div style="
              margin-bottom: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid #2a2a2a;
            ">
              <p style="
                margin: 0 0 8px;
                color: #888;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">
                Items:
              </p>
              <ul style="
                margin: 0;
                padding: 0;
                list-style: none;
              ">
                ${garmentsList}
              </ul>
            </div>

            <!-- Total Amount -->
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="color: #888; font-size: 13px;">Total Amount:</span>
              <span style="
                color: #f0c040;
                font-size: 16px;
                font-weight: 700;
              ">
                ₹${totalAmount}
              </span>
            </div>
          </div>

          <!-- Delivery Info -->
          <div style="
            background: #1a1a1a;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            border-left: 3px solid #4CAF50;
          ">
            <p style="
              margin: 0 0 8px;
              color: #4CAF50;
              font-size: 13px;
              font-weight: 600;
            ">
              📅 Next Step
            </p>
            <p style="
              margin: 0;
              color: #bbb;
              font-size: 13px;
              line-height: 1.5;
            ">
              Your order is ready for delivery. We'll deliver your items by <strong>${estimatedDelivery}</strong>.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.FRONTEND_URL || "https://cleanpress.local"}/my-orders" style="
              display: inline-block;
              background: linear-gradient(135deg, #f0c040, #d4a010);
              color: #111;
              padding: 12px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              transition: transform 0.2s;
            ">
              Track Your Order
            </a>
          </div>

          <!-- Footer Note -->
          <div style="
            padding: 16px;
            background: #1a1a1a;
            border-radius: 6px;
            border: 1px solid #2a2a2a;
          ">
            <p style="
              margin: 0;
              color: #666;
              font-size: 12px;
              line-height: 1.6;
            ">
              📞 <strong>Need help?</strong> Reply to this email or contact our support team. We're here to assist you!
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="
          background: #0a0a0a;
          padding: 20px 28px;
          text-align: center;
          border-top: 1px solid #2a2a2a;
        ">
          <p style="
            margin: 0 0 8px;
            color: #555;
            font-size: 11px;
          ">
            © 2024 CleanPress Laundry Management System
          </p>
          <p style="
            margin: 0;
            color: #444;
            font-size: 10px;
          ">
            This is an automated notification. Please do not reply directly.
          </p>
        </div>
      </div>
    `,
  };
};

/**
 * Order Delivered Notification Template
 * (Optional - for future use when order is delivered)
 */
const orderDeliveredTemplate = (customerName, orderId, actualDeliveryDate) => {
  const deliveryDate = new Date(actualDeliveryDate).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return {
    subject: `📦 Your Order ${orderId} Has Been Delivered`,
    html: `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 520px;
        margin: 0 auto;
        background: #0f0f0f;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid #2a2a2a;
      ">
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #4CAF50, #388E3C);
          padding: 28px;
          text-align: center;
        ">
          <h1 style="
            margin: 0;
            color: #fff;
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.5px;
          ">
            ✅ Delivered
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px 28px;">
          <p style="
            margin: 0 0 16px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
          ">
            Thank you, ${customerName}!
          </p>

          <p style="
            margin: 0 0 20px;
            color: #aaa;
            font-size: 14px;
            line-height: 1.6;
          ">
            Your order <strong style="color: #4CAF50;">${orderId}</strong> was successfully delivered on <strong>${deliveryDate}</strong>.
          </p>

          <p style="
            margin: 0;
            color: #aaa;
            font-size: 13px;
            line-height: 1.6;
          ">
            We appreciate your business! If you have any feedback or issues, please don't hesitate to reach out.
          </p>
        </div>

        <!-- Footer -->
        <div style="
          background: #0a0a0a;
          padding: 20px 28px;
          text-align: center;
          border-top: 1px solid #2a2a2a;
        ">
          <p style="
            margin: 0;
            color: #555;
            font-size: 11px;
          ">
            © 2024 CleanPress Laundry Management System
          </p>
        </div>
      </div>
    `,
  };
};

module.exports = {
  orderReadyTemplate,
  orderDeliveredTemplate,
};
