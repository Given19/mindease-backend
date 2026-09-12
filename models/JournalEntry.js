const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const JournalEntry = sequelize.define('JournalEntry', {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

JournalEntry.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(JournalEntry, { foreignKey: 'userId' });

module.exports = JournalEntry;