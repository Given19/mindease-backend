const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const DiaryEntry = sequelize.define('DiaryEntry', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  suggestion: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  motivation: {
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

DiaryEntry.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(DiaryEntry, { foreignKey: 'userId' });

module.exports = DiaryEntry;