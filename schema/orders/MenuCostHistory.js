const { DataTypes } = require('sequelize');
const database = require('../../order_db');

const MenuCostHistory = database.define('MenuCostHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  rest_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'レストランID'
  },

  menu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'menu.id（論理的関連）'
  },

  cost_price_ex_tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '税抜原価（1皿あたり・確定値）'
  },

  cost_breakdown_json: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '原価内訳・メモ用JSON（任意）'
  },

  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }

}, {
  tableName: 'menu_cost_history',
  timestamps: true,
  underscored: true
});

module.exports = MenuCostHistory;
