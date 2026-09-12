const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendBookingEmail(therapist, user, appointment) {
  const formattedDate = new Date(appointment.appointmentDate).toLocaleString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const messageBlock = appointment.message
    ? `\nMessage from client:\n${appointment.message}\n`
    : '';

  await transporter.sendMail({
    from: `"MindEase" <${process.env.SMTP_USER}>`,
    to: therapist.email,
    subject: 'New Appointment Request - MindEase',
    text:
      `Hello ${therapist.name},\n\n` +
      `You have a new appointment request through MindEase.\n\n` +
      `Client: ${user.firstName} ${user.lastName}\n` +
      `Client Email: ${user.email}\n` +
      `Session Type: ${appointment.sessionType}\n` +
      `Session Fee: R${appointment.price}\n` +
      `Date & Time: ${formattedDate}\n` +
      `${messageBlock}\n` +
      `Please log in or reply to confirm or decline this appointment.\n\n` +
      `- MindEase`
  });
}

module.exports = { sendBookingEmail };