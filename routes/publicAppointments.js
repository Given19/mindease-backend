const express = require('express');
const Appointment = require('../models/Appointment');

const router = express.Router();

function renderResultPage(title, message) {
  return `
    <html>
      <head><title>${title}</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 60px 20px;">
        <h1>${title}</h1>
        <p style="font-size: 18px; color: #444;">${message}</p>
      </body>
    </html>
  `;
}

router.get('/:token/confirm', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { confirmToken: req.params.token }
    });

    if (!appointment) {
      return res.status(404).send(renderResultPage('Not Found', 'This appointment link is invalid or has expired.'));
    }

    if (appointment.status === 'Cancelled') {
      return res.send(renderResultPage('Already Cancelled', 'This appointment was already cancelled by the client.'));
    }

    appointment.status = 'Confirmed';
    await appointment.save();

    res.send(renderResultPage('Appointment Confirmed ✅', 'Thank you — the client will see this update in the MindEase app.'));
  } catch (err) {
    res.status(500).send(renderResultPage('Error', 'Something went wrong. Please try again.'));
  }
});

router.get('/:token/decline', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { confirmToken: req.params.token }
    });

    if (!appointment) {
      return res.status(404).send(renderResultPage('Not Found', 'This appointment link is invalid or has expired.'));
    }

    if (appointment.status === 'Cancelled') {
      return res.send(renderResultPage('Already Cancelled', 'This appointment was already cancelled by the client.'));
    }

    appointment.status = 'Declined';
    await appointment.save();

    res.send(renderResultPage('Appointment Declined', 'Thank you — the client will see this update in the MindEase app.'));
  } catch (err) {
    res.status(500).send(renderResultPage('Error', 'Something went wrong. Please try again.'));
  }
});

module.exports = router;