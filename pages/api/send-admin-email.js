// pages/api/send-admin-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      start_date,
      end_date,
      total_price,
      car_details
    } = req.body;

    // Configurer nodemailer avec Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Utiliser un mot de passe d'application pour Gmail
      },
      debug: true,
      logger: true,
    });

    // Formater les dates pour une meilleure lisibilité
    const formattedStartDate = new Date(start_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedEndDate = new Date(end_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Contenu de l'email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle réservation de voiture - ${car_details.make} ${car_details.model}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-left: 4px solid #dc2626;">
          <h2 style="color: #dc2626; margin-top: 0;">Nouvelle réservation de voiture</h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <h3 style="margin-top: 0;">Informations du client</h3>
            <p><strong>Nom :</strong> ${customer_name}</p>
            <p><strong>Email :</strong> ${customer_email}</p>
            <p><strong>Téléphone :</strong> ${customer_phone}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <h3 style="margin-top: 0;">Détails de la réservation</h3>
            <p><strong>Véhicule :</strong> ${car_details.year} ${car_details.make} ${car_details.model}</p>
            <p><strong>Date de prise en charge :</strong> ${formattedStartDate}</p>
            <p><strong>Date de retour :</strong> ${formattedEndDate}</p>
            <p><strong>Prix total :</strong> ${total_price.toFixed(2)} TND</p>
          </div>
          
          <p style="color: #666;">Cet email a été généré automatiquement par le système de location de voitures.</p>
        </div>
      `,
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    res.status(500).json({ success: false, error: error.message });
  }
}