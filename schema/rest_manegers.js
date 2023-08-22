const Sequelize = require('sequelize');
const database = require('../db');

const Rest_manegers = database.define('rest_maneger', {
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
    work_status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pickup_time: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cach: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
    },
  bank: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
    },
    uber: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
    },
    squere: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
    },
    cash_s: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
    }

});

module.exports = Rest_manegers;
