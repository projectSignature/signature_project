const Sequelize = require('sequelize');
const database = require('../db');

const Suppliers = database.define('m_suppliers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name_pt: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    name_jp: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    adress: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    tel: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    representative: {
      type: Sequelize.STRING(100),
      allowNull: false
    }
});

module.exports = Suppliers;
