const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { title, content, date } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const entry = await JournalEntry.create({
      title: title || '',
      content,
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
    const entries = await JournalEntry.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']]
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;