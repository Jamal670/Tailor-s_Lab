const nodemailer = require("nodemailer");

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "noreplyrizydra@gmail.com",
    pass: "fkoiwnldvdenlhpy",
  },
});

// Function to generate a 5-digit product code
const generateProductCode = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

// Function to generate tracking ID (format: TL-YYYYMMDD-XXXXXX)
const generateTrackingId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TL-${dateStr}-${randomStr}`;
};

//--------------------------------- User account update mail-----------------------------
const MailToAdminOrder = async ({ name, email, date }) => {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: email,
    subject: "New Order Notification - Tailor",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">🔔 Account Updated</h2>
          
          <p style="font-size: 15px; color: #333;">Dear <b>${name}</b>,</p>
          
          <p style="font-size: 15px; color: #333;">
            Your account was updated on <b>${date}</b>. If you wish to review your account details, please log in to your dashboard.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://rizydra.com/login" target="_blank" style="
              background: linear-gradient(90deg, #2b6cb0, #4299e1);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">Login to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Thank you for using <b>Rizydra</b>.
          </p>

          <p style="font-size: 14px; color: #555;">
            Regards,<br/>
            <b style="color:#2b6cb0;">Rizydra Support Team</b>
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color:#888; text-align:center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Account update email sent", info };
  } catch (err) {
    return { success: false, message: "Failed to send account update email", error: err };
  }
};

// -------------------- Send Order Email to Admin --------------------
const sendOrderEmailToAdmin = async ({ trackingId, orderData, customerData, items }) => {
  const adminEmail = "jamalobaid2@gmail.com";
  
  const itemsTableRows = items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; text-align: left;">${item.name || 'N/A'}</td>
      <td style="padding: 12px; text-align: center;">${item.size || 'N/A'}</td>
      <td style="padding: 12px; text-align: center;">${item.color || 'N/A'}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity || 0}</td>
      <td style="padding: 12px; text-align: center;">${item.pro_code || 'N/A'}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: adminEmail,
    subject: `New Order Received – Tracking ID: ${trackingId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 800px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 30px;">📦 New Order Received</h2>
          
          <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1a5490; margin-top: 0; margin-bottom: 15px;">Tracking ID</h3>
            <p style="font-size: 18px; font-weight: 600; color: #2b6cb0; margin: 0;">${trackingId}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #333; border-bottom: 2px solid #2b6cb0; padding-bottom: 10px; margin-bottom: 15px;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555; width: 40%;">First Name:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.firstName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Last Name:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.lastName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Phone Number:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Email Address:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Street Address:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.streetAddress || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">City:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.city || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Country:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.country || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Zip Code:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.zipcode || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Payment Method:</td>
                <td style="padding: 8px 0; color: #333;">${customerData.paymentMethod || 'N/A'}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #333; border-bottom: 2px solid #2b6cb0; padding-bottom: 10px; margin-bottom: 15px;">Product Details</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background: #2b6cb0; color: white;">
                  <th style="padding: 12px; text-align: left;">Product Name</th>
                  <th style="padding: 12px; text-align: center;">Size</th>
                  <th style="padding: 12px; text-align: center;">Color</th>
                  <th style="padding: 12px; text-align: center;">Quantity</th>
                  <th style="padding: 12px; text-align: center;">Product Code</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>
          </div>

          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 25px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Total Amount:</strong> $${(orderData.totalAmount || 0).toFixed(2)}
            </p>
          </div>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color:#888; text-align:center;">
            © ${new Date().getFullYear()} Tailor Lab — Premium Tailoring Services
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Admin order email sent", info };
  } catch (err) {
    console.error("Admin Email Error:", err);
    return { success: false, message: "Failed to send admin order email", error: err };
  }
};

// -------------------- Send Order Confirmation Email to Customer --------------------
const sendOrderEmailToCustomer = async ({ trackingId, customerEmail, items, totalAmount }) => {
  const itemsTableRows = items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; text-align: left;">${item.name || 'N/A'}</td>
      <td style="padding: 12px; text-align: center;">${item.size || 'N/A'}</td>
      <td style="padding: 12px; text-align: center;">${item.color || 'N/A'}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity || 0}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: customerEmail,
    subject: `Your Order Confirmation – Tracking ID: ${trackingId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">Order Confirmed!</h2>
          
          <p style="font-size: 16px; color: #333; text-align: center; margin-bottom: 25px;">
            Thank you for shopping with us!
          </p>

          <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #555; margin-bottom: 5px;">Your Tracking ID</p>
            <p style="font-size: 20px; font-weight: 600; color: #2b6cb0; margin: 0;">${trackingId}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #333; border-bottom: 2px solid #2b6cb0; padding-bottom: 10px; margin-bottom: 15px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background: #2b6cb0; color: white;">
                  <th style="padding: 12px; text-align: left;">Product Name</th>
                  <th style="padding: 12px; text-align: center;">Size</th>
                  <th style="padding: 12px; text-align: center;">Color</th>
                  <th style="padding: 12px; text-align: center;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>
          </div>

          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 25px; text-align: right;">
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #333;">
              Total: $${(totalAmount || 0).toFixed(2)}
            </p>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px; text-align: center;">
            We'll send you another email when your order ships.
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color:#888; text-align:center;">
            © ${new Date().getFullYear()} Tailor Lab — Premium Tailoring Services
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Customer order email sent", info };
  } catch (err) {
    console.error("Customer Email Error:", err);
    return { success: false, message: "Failed to send customer order email", error: err };
  }
};

module.exports = {
  generateProductCode,
  generateTrackingId,
  MailToAdminOrder,
  sendOrderEmailToAdmin,
  sendOrderEmailToCustomer,
};