const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CommunityPost = sequelize.define('CommunityPost', {
  content: { type: DataTypes.TEXT, allowNull: false },
  isAnonymous: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  reportCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isHidden: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
});

CommunityPost.belongsTo(User, { foreignKey: 'userId', as: 'author', onDelete: 'CASCADE' });
User.hasMany(CommunityPost, { foreignKey: 'userId' });

module.exports = CommunityPost;