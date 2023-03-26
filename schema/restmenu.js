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
        allowNull: false
    },
    menu_name_0: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false
    },
    menu_name_1: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false
    },
    menu_name_2: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false
    },
    menu_value: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
    },
    rest_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    }
});

module.exports = RestMenus;
