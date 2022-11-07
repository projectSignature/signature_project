const Sequelize = require('sequelize');
const database = require('../db');

const Entrance = database.define('entrance', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    LESSON_NAME: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    LESSON_HOUR: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    MEMBER_ID: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

});

module.exports = Entrance;