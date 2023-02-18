const Sequelize = require('sequelize');
const database = require('../db');

const Finencepays = database.define('finencepay', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    GYM_ID: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },

    CATEGORY: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },

    NAME: {
        type: Sequelize.STRING(150),
        allowNull: false,
    },

    VALUE: {
        type: Sequelize.STRING(150),
    },

    COLOR: {
        type: Sequelize.STRING(150),
        allowNull: false,
    },
    
    KUBUN: {
      type:Sequelize.DECIMAL,
      allowNull: false
    },

    Date: {
        type: Sequelize.STRING(150),
    },

});

module.exports = Finencepays;
