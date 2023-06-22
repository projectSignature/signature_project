const Sequelize = require('sequelize');
const database = require('../db');

const RestMenus = database.define('restmenu', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    menu_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    menu_child_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    menu_name_0: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    menu_name_1: {
        type: Sequelize.STRING(150)
    },
    menu_name_2: {
        type: Sequelize.STRING(150)
    },
    menu_value: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },    
    control_name: {
      type: Sequelize.STRING(150),
      unique: false,
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = RestMenus;
