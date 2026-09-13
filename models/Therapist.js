const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Therapist = sequelize.define('Therapist', {
  name: { type: DataTypes.STRING, allowNull: false },
  specialty: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
  email: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  officeAddress: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  priceInPerson: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  priceOnline: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  pricePhone: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Therapist;