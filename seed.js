require('dotenv').config();
const sequelize = require('./config/database');
const Therapist = require('./models/Therapist');
const Appointment = require('./models/Appointment');

const therapists = [
  {
    name: 'Dr. Naledi Khumalo',
    specialty: 'Anxiety & Stress',
    bio: '10+ years helping clients manage anxiety and daily stress.',
    email: 'naledi.khumalo.demo@example.com',
    phoneNumber: '012 345 6789',
    officeAddress: '12 Church Street, Pretoria',
    priceInPerson: 650,
    priceOnline: 550,
    pricePhone: 450,
    latitude: -25.7461,
    longitude: 28.1881
  },
  {
    name: 'Dr. Sipho Dlamini',
    specialty: 'Depression',
    bio: 'Focuses on CBT-based approaches for depression and low mood.',
    email: 'sipho.dlamini.demo@example.com',
    phoneNumber: '011 456 7890',
    officeAddress: '45 Jan Smuts Ave, Johannesburg',
    priceInPerson: 700,
    priceOnline: 600,
    pricePhone: 500,
    latitude: -26.2041,
    longitude: 28.0473
  },
  {
    name: 'Dr. Aisha Patel',
    specialty: 'Relationships & Family',
    bio: 'Specialises in relationship, family, and communication issues.',
    email: 'aisha.patel.demo@example.com',
    phoneNumber: '031 567 8901',
    officeAddress: '8 Florida Road, Durban',
    priceInPerson: 600,
    priceOnline: 500,
    pricePhone: 400,
    latitude: -29.8587,
    longitude: 31.0218
  },
  {
    name: 'Dr. Johan van der Merwe',
    specialty: 'Academic & Work Stress',
    bio: 'Works closely with students and young professionals.',
    email: 'johan.vdmerwe.demo@example.com',
    phoneNumber: '021 678 9012',
    officeAddress: '3 Long Street, Cape Town',
    priceInPerson: 550,
    priceOnline: 450,
    pricePhone: 350,
    latitude: -33.9249,
    longitude: 18.4241
  }
];

async function seed() {
  try {
    await sequelize.sync();

    await Appointment.destroy({ where: {}, truncate: true, cascade: true });
    await Therapist.destroy({ where: {}, truncate: true, cascade: true });

    await Therapist.bulkCreate(therapists);
    console.log('Re-seeded therapists successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();