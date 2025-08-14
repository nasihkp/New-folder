import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests to this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extract data from the request body
  const { userName, userEmail, userAddress, cart } = req.body;

  if (!userName || !userEmail || !userAddress || !cart || cart.length === 0) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  try {
    // --- Step 1: Create the email transporter ---
    // The credentials here must be stored as Vercel Environment Variables.
    // DO NOT hardcode them.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // Use 'true' for port 465, 'false' for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // --- Step 2: Generate the email content ---
    let orderDetails = '';
    let total = 0;
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      orderDetails += `<li>${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${subtotal.toFixed(2)}</li>`;
    });

    const emailHtml = `
      <h1>New Order from The Green Thumb</h1>
      <h2>Customer Details</h2>
      <ul>
        <li><strong>Name:</strong> ${userName}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
        <li><strong>Address:</strong> ${userAddress}</li>
      </ul>
      <h2>Order Summary</h2>
      <ul>
        ${orderDetails}
      </ul>
      <h3>Total: $${total.toFixed(2)}</h3>
    `;

    // --- Step 3: Send the email ---
    await transporter.sendMail({
      from: process.env.SMTP_USER, // The sender's email
      to: 'nasihkp0271@gmail.com', // Your email address
      subject: `New Order from ${userName}`,
      html: emailHtml,
    });

    // Send a success response
    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
