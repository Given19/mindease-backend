const express = require('express');
const Therapist = require('../models/Therapist');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.use(adminAuth);

router.get('/therapists/pending', async (req, res) => {
  try {
    const pending = await Therapist.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'ASC']]
    });

    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/therapists/:id/approve', async (req, res) => {
  try {
    const therapist = await Therapist.findByPk(req.params.id);

    if (!therapist) {
      return res.status(404).json({ message: 'Not found.' });
    }

    therapist.status = 'approved';
    await therapist.save();

    res.json({ message: 'Approved.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/therapists/:id/reject', async (req, res) => {
  try {
    const therapist = await Therapist.findByPk(req.params.id);

    if (!therapist) {
      return res.status(404).json({ message: 'Not found.' });
    }

    therapist.status = 'rejected';
    await therapist.save();

    res.json({ message: 'Rejected.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;