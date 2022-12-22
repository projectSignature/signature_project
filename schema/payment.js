const Sequelize = require('sequelize');
const database = require('../db');

const Payment = database.define('payments', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    nm_member_id: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    nm_member: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    year: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    jan: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },

    feb: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    mar: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    abr: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    may: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    jun: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    jul: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    aug: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    sep: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    oct: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    nov: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    dez: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    obs: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    plan: {
        type: Sequelize.STRING(150),
        allowNull: false
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

});

module.exports = Payment;