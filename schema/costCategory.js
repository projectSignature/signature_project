const Sequelize = require('sequelize');
const database = require('../db');

const Costcategory = database.define('costCategory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    control_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    name_jp: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    name_pt: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    icon_id: {
        type: Sequelize.INTEGER,
    },
    tax: {
        type: Sequelize.INTEGER,
    },
    tax_kubun: {
        type: Sequelize.INTEGER,
    }
});

module.exports = Costcategory;
