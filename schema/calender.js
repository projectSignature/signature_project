const Sequelize = require('sequelize');
const database = require('../db');

const Calender = database.define('calender', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    GYM_ID: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    DAY: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    START_TIME: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    FINISH_TIME: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    LINE_NO: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },

    DESCRITION_1: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    DESCRITION_2: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    IMAGE: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    COLOR: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

});

module.exports = Calender;