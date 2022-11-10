const Sequelize = require('sequelize');
const database = require('../db');

const Clients = database.define('client', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    GYM_NAME: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {    
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        } 
    }, 

    REPRESENTATIVE: {
        unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {    
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        } 
    },   

    UNIQUE_CODE: {
        type:Sequelize.DECIMAL,
        allowNull: false
    },

    PASSWORD: {
        type:Sequelize.STRING(150),
        allowNull: false
    },

    ADRESS: {
        type:Sequelize.STRING(150),
        allowNull: false
    },

    TEL: {
        type:Sequelize.DECIMAL,
        allowNull: false
    },

    EMAIL: {
        type:Sequelize.STRING(150),
        allowNull: false
    },
   
    SAVE_DAY: {
        type:Sequelize.STRING(150),
        allowNull: false
    },
   
    STATUS: {
        type:Sequelize.STRING(150),
        allowNull: false
    },
   
    LANGUAGE: {
        type: Sequelize.STRING(150),
        allowNull: false
    }
    
});

module.exports = Clients;
