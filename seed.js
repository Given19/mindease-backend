require('dotenv').config();
const sequelize = require('./config/database');
const Therapist = require('./models/Therapist');

const therapists = [
  {
    name: 'Dr. Naledi Khumalo',
    specialty: 'Anxiety & Stress',
    bio: '10+ years helping clients manage anxiety and daily stress.',
    email: 'naledi.khumalo.demo@example.com',
    latitude: -25.7461,
    longitude: 28.1881
  },
  {
    name: 'Dr. Sipho Dlamini',
    specialty: 'Depression',
    bio: 'Focuses on CBT-based approaches for depression and low mood.',
    email: 'sipho.dlamini.demo@example.com',
    latitude: -26.2041,
    longitude: 28.0473
  },
  {
    name: 'Dr. Aisha Patel',
    specialty: 'Relationships & Family',
    bio: 'Specialises in relationship, family, and communication issues.',
    email: 'aisha.patel.demo@example.com',
    latitude: -29.8587,
    longitude: 31.0218
  },
  {
    name: 'Dr. Johan van der Merwe',
    specialty: 'Academic & Work Stress',
    bio: 'Works closely with students and young professionals.',
    email: 'johan.vdmerwe.demo@example.com',
    latitude: -33.9249,
    longitude: 18.4241
  }
];

async function seed() {
  try {
    await sequelize.sync();

    const count = await Therapist.count();

    if (count > 0) {
      console.log('Therapists already seeded, skipping.');
      process.exit(0);
    }

    await Therapist.bulkCreate(therapists);
    console.log('Seeded therapists successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();