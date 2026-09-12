const express = require('express');
const Therapist = require('../models/Therapist');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const therapists = await Therapist.findAll();

    if (!lat || !lng) {
      return res.json(therapists);
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const withDistance = therapists
      .map((t) => {
        const distanceKm = getDistanceKm(
          userLat,
          userLng,
          t.latitude,
          t.longitude
        );

        return {
          ...t.toJSON(),
          distanceKm: Math.round(distanceKm * 10) / 10
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(withDistance);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;