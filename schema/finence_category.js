const Sequelize = require('sequelize');
const database = require('../db');

const Finence_categorys = database.define('finence_category', {
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

    KUBUN: {
      type:Sequelize.DECIMAL,
      allowNull: false
    },

    COLOR: {
        type: Sequelize.STRING(150),
        allowNull: false,
    },


});

module.exports = Finence_categorys;
