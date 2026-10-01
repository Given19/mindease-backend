const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const CommunityPost = require('./CommunityPost');

const CommunityComment = sequelize.define('CommunityComment', {
  content: { type: DataTypes.TEXT, allowNull: false },
  isAnonymous: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  reportCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isHidden: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
});

CommunityComment.belongsTo(User, { foreignKey: 'userId', as: 'author', onDelete: 'CASCADE' });
User.hasMany(CommunityComment, { foreignKey: 'userId' });

CommunityComment.belongsTo(CommunityPost, { foreignKey: 'postId', onDelete: 'CASCADE' });
CommunityPost.hasMany(CommunityComment, { foreignKey: 'postId', as: 'comments' });

module.exports = CommunityComment;