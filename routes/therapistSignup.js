const express = require('express');
const Therapist = require('../models/Therapist');
const { geocodeAddress } = require('../config/geocode');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      name, specialty, bio, email, phoneNumber, officeAddress,
      priceInPerson, priceOnline, pricePhone,
      licenseNumber, licenseBody, country
    } = req.body;

    if (!name || !specialty || !email || !officeAddress || !licenseNumber || !licenseBody || !country) {
      return res.status(400).json({
        message: 'Name, specialty, email, address, license number, license body, and country are required.'
      });
    }

    const location = await geocodeAddress(officeAddress);

    if (!location) {
      return res.status(400).json({
        message: 'Could not find that address. Please check it and try again, or use a more specific address.'
      });
    }

    const therapist = await Therapist.create({
      name,
      specialty,
      bio: bio || '',
      email,
      phoneNumber: phoneNumber || '',
      officeAddress,
      priceInPerson: priceInPerson || 0,
      priceOnline: priceOnline || 0,
      pricePhone: pricePhone || 0,
      latitude: location.latitude,
      longitude: location.longitude,
      licenseNumber,
      licenseBody,
      country,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Application received. Your profile will be reviewed before it becomes visible to users.',
      id: therapist.id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;