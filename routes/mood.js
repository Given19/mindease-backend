const express = require('express');
const MoodEntry = require('../models/MoodEntry');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { mood, notes, date } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required.' });
    }

    const entry = await MoodEntry.create({
      mood,
      notes: notes || '',
      date: date || new Date(),
      userId: req.userId
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const entries = await MoodEntry.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']]
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;