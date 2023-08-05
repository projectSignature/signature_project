const Sequelize = require('sequelize');
const database = require('../db');

const Restadmins = database.define('restadmin', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rest_id: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    worker_name: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    adress: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    password: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    status: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    language:{
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

module.exports = Restadmins;
