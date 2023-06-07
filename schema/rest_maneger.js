const Sequelize = require('sequelize');
const database = require('../db');

const Rest_manegers = database.define('rest_manegers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rest_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    work_status: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    pickup_time: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },

});

module.exports = Rest_manegers;
