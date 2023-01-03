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

    month: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    division: {
       type: Sequelize.DECIMAL,
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

    plan_value: {
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
