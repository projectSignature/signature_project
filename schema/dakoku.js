const Sequelize = require('sequelize');
const database = require('../db');

const Dakokus = database.define('dakoku', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    worker_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    st: {
        type: Sequelize.STRING(45)
    },
    fn: {
        type: Sequelize.STRING(45)
    },
    workday: {
        type: Sequelize.STRING(45)
    }
});

module.exports = Dakokus;
