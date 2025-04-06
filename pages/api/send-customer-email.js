// /api/send-customer-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    customer_email,
    customer_name,
    reservationId,
    startDateFormatted,
    endDateFormatted,
    total_price,
    car_details,
  } = req.body;

  // Create a transporter using your email service (e.g., Gmail, SMTP, etc.)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Utiliser un mot de passe d'application pour Gmail
      },
      debug: true,
      logger: true,
    });

  // Email options
  const mailOptions = {
    from: process.env.GMAIL_USER, // Sender address
    to: customer_email, // Recipient address
    subject: 'Confirmation de votre réservation de voiture',
    html: `
      <h1>Confirmation de Réservation</h1>
      <p>Bonjour ${customer_name},</p>
      <p>Votre réservation (ID: ${reservationId}) a été confirmée avec succès.</p>
      <h2>Détails de la Réservation</h2>
      <p><strong>Véhicule:</strong> ${car_details.make} ${car_details.model} (${car_details.year})</p>
      <p><strong>Date de prise en charge:</strong> ${startDateFormatted}</p>
      <p><strong>Date de retour:</strong> ${endDateFormatted}</p>
      <p><strong>Prix total:</strong> ${total_price.toFixed(2)} TND</p>
      <p>Merci de nous avoir choisis !</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}