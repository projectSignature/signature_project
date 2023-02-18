const Sequelize = require('sequelize');
const database = require('../db');

const Expenses = database.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    category: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },

    expense_id: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },

    GYM_ID: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },

    NAME: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },

    VALUE: {
        type: Sequelize.STRING(100),
    },

    COLOR: {
      type: Sequelize.STRING(100),
      allowNull: false
    },

    KUBUN: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },

    STATUS: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },

    Date: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },

    note: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },

});

module.exports = Expenses;
