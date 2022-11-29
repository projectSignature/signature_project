const Sequelize = require('sequelize');
const database = require('../db');

const Entrance = database.define('entrance', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    LESSON_NAME: {
        type: Sequelize.STRING(150),
        allowNull: false,
        
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    LESSON_HOUR: {
        type: Sequelize.STRING(150),
        allowNull: false,
        
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },

    MEMBER_ID: {
        type: Sequelize.DECIMAL,
        allowNull: false,
       
        validate: {
            notEmpty: {
                msg: "Esse campo não pode está vazio.."
            },
        }
    },
    
    GYM_ID: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },

});

module.exports = Entrance;
