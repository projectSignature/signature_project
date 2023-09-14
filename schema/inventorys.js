const Sequelize = require('sequelize');
const database = require('../db');

const Inventorys = database.define('inventory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    name: {
      type: Sequelize.STRING(45),
      unique: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cust: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    updt: {
      type: Sequelize.STRING(45),
      unique: false,
    },
    categorys: {
      type: Sequelize.STRING(45),
      unique: false,
    }

});

module.exports = Inventorys;
