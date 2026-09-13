const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const BASE_URL = process.env.BASE_URL || 'https://mindease-backend-c9aq.onrender.com';

async function sendBookingEmail(therapist, user, appointment) {
  const formattedDate = new Date(appointment.appointmentDate).toLocaleString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const confirmUrl = `${BASE_URL}/api/public/appointments/${appointment.confirmToken}/confirm`;
  const declineUrl = `${BASE_URL}/api/public/appointments/${appointment.confirmToken}/decline`;

  const messageBlock = appointment.message
    ? `\nMessage from client:\n${appointment.message}\n`
    : '';

  const textBody =
    `Hello ${therapist.name},\n\n` +
    `You have a new appointment request through MindEase.\n\n` +
    `Client: ${user.firstName} ${user.lastName}\n` +
    `Client Email: ${user.email}\n` +
    `Session Type: ${appointment.sessionType}\n` +
    `Session Fee: R${appointment.price}\n` +
    `Date & Time: ${formattedDate}\n` +
    `${messageBlock}\n` +
    `To CONFIRM this appointment, click here:\n${confirmUrl}\n\n` +
    `To DECLINE this appointment, click here:\n${declineUrl}\n\n` +
    `- MindEase`;

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 500px;">
      <p>Hello ${therapist.name},</p>
      <p>You have a new appointment request through MindEase.</p>
      <p>
        <strong>Client:</strong> ${user.firstName} ${user.lastName}<br/>
        <strong>Client Email:</strong> ${user.email}<br/>
        <strong>Session Type:</strong> ${appointment.sessionType}<br/>
        <strong>Session Fee:</strong> R${appointment.price}<br/>
        <strong>Date &amp; Time:</strong> ${formattedDate}
      </p>
      ${appointment.message ? `<p><strong>Message from client:</strong><br/>${appointment.message}</p>` : ''}
      <p>
        <a href="${confirmUrl}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;margin-right:10px;">✅ Confirm</a>
        <a href="${declineUrl}" style="background:#D9534F;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">❌ Decline</a>
      </p>
      <p>- MindEase</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MindEase" <${process.env.SMTP_USER}>`,
    to: therapist.email,
    subject: 'New Appointment Request - MindEase',
    text: textBody,
    html: htmlBody
  });
}

module.exports = { sendBookingEmail };