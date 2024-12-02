const Sequelize = require('sequelize');
const database = require('../../registerDb');

const Client = database.define('clients', {
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
  client_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  client_name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  client_address: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  client_phone: {
    type: Sequelize.STRING(20),
    allowNull: true
  },
  client_contact_person: {
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
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'client_id']
    }
  ]
});

module.exports = Client;
