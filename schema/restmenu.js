const Sequelize = require('sequelize');
const database = require('../db');

const RestMenus = database.define('restMenu', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    menu_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    menu_child_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    menu_name_0: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    menu_name_1: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    menu_name_2: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    menu_value: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    rest_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = RestMenus;
