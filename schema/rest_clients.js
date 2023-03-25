const Sequelize = require('sequelize');
const database = require('../db');

const RestClients = database.define('restClient', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    phone: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    adress: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    post: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
      password: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    }
});

module.exports = RestClients;
