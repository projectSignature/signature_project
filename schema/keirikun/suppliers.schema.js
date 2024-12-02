const Sequelize = require('sequelize');
const database = require('../../registerDb');

const Supplier = database.define('suppliers', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  supplier_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  supplier_name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  supplier_address: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  supplier_phone: {
    type: Sequelize.STRING(20),
    allowNull: true
  },
  supplier_contact_person: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  updated_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  kubun:{
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'supplier_id']
    }
  ]
});

module.exports = Supplier;
