const Sequelize = require('sequelize');
const database = require('../db');

const Costrests = database.define('costrest', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    worker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    cost_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    amount: {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    payday:{
      type: Sequelize.DATE,
      validate: {
       notEmpty: {
          msg: "Esse campo não pode está vazio.."
       },
      }
    },
    memo:{
      type:Sequelize.STRING(200),
      allowNull: false
    },
    paykubun: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
});

module.exports = Costrests;
