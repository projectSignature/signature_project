const Sequelize = require('sequelize');
const database = require('../db');

const Parents = database.define('parent', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    family_name: {unique: false,
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    birthday: Sequelize.STRING(150),

    birthday_age: Sequelize.STRING(150),

    gender: {
        type:Sequelize.STRING(150),
        allowNull: false
    },

     gymid: {
        type: Sequelize.STRING(150),
        allowNull: false
    },

    nm_member_id: {
        type: Sequelize.INTEGER,
         allowNull: false,
    }


});

module.exports = Parents;
