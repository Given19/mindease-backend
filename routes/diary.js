const express = require('express');
const DiaryEntry = require('../models/DiaryEntry');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { content, mood, suggestion, motivation, date } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const entry = await DiaryEntry.create({
      content,
      mood: mood || '',
      suggestion: suggestion || '',
      motivation: motivation || '',
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
    const entries = await DiaryEntry.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']]
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;