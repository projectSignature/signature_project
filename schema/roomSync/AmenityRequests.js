const { DataTypes } = require('sequelize');
const database = require('../../roomSync'); // ← あなたのDB接続設定

const AmenityRequest = database.define('AmenityRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '対象の部屋ID'
  },
  amenity: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'アメニティ名称'
  },
  action_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '交換／補充／回収'
  },
  return_to: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'フロント or 倉庫室'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    comment: '依頼状態（pending, done など）'
  }
,
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'amenity_requests',
  timestamps: false
});

const Room = require('./Rooms');
AmenityRequest.belongsTo(Room, { foreignKey: 'room_id' });


module.exports = AmenityRequest;
