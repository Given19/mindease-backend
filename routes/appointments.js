const express = require('express');
const Appointment = require('../models/Appointment');
const Therapist = require('../models/Therapist');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { sendBookingEmail } = require('../config/mailer');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { therapistId, appointmentDate, sessionType, price, message } = req.body;

    if (!therapistId || !appointmentDate || !sessionType) {
      return res.status(400).json({
        message: 'therapistId, appointmentDate and sessionType are required.'
      });
    }

    const therapist = await Therapist.findByPk(therapistId);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found.' });
    }

    const user = await User.findByPk(req.userId);

    const appointment = await Appointment.create({
      therapistId,
      appointmentDate,
      sessionType,
      price: price || 0,
      message: message || '',
      status: 'Pending',
      userId: req.userId
    });

    try {
      await sendBookingEmail(therapist, user, appointment);
    } catch (emailErr) {
      console.error('Failed to send booking email:', emailErr.message);
    }

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.userId },
      include: [{ model: Therapist, as: 'therapist' }],
      order: [['appointmentDate', 'ASC']]
    });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;