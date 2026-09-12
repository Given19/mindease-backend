const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Therapist = require('./Therapist');

const Appointment = sequelize.define('Appointment', {
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  sessionType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'In-Person'
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending'
  }
});

Appointment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Appointment, { foreignKey: 'userId' });

Appointment.belongsTo(Therapist, { foreignKey: 'therapistId', onDelete: 'CASCADE' });
Therapist.hasMany(Appointment, { foreignKey: 'therapistId' });

module.exports = Appointment;