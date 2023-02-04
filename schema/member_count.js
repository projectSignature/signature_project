const Sequelize = require('sequelize');
const database = require('../db');

const MembersCount = database.define('member_count', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    GYM_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    YEAR: {
        type:Sequelize.STRING(45),
        allowNull: false
    },

    MOUNTH: {
        type:Sequelize.STRING(45),
        allowNull: false
    },

    COUNT: {
        type:Sequelize.STRING(45),
        allowNull: false
    },
});

module.exports = MembersCount;
