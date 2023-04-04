const Sequelize = require('sequelize');
const database = require('../db');

const Historyorders = database.define('historyorder', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    menu_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    menu_child_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    menu_value: {
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    quantity_menu: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

module.exports = Historyorders;
