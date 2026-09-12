const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const MoodEntry = sequelize.define('MoodEntry', {
  mood: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

MoodEntry.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(MoodEntry, { foreignKey: 'userId' });

module.exports = MoodEntry;   