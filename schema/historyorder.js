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
        type: Sequelize.STRING(150),
        allowNull: false
    },
    menu_child_id: {
        type: Sequelize.STRING(150),
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
        type: Sequelize.STRING(150),
        allowNull: false
    },
    order_id: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    paykubun: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    obs:{
      type: Sequelize.STRING(300),
      allowNull: false
    },
    pickUp_day:{
      type: Sequelize.STRING(45),
      allowNull: false
    },
    pickUp_way:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    client_name: {
        type: Sequelize.STRING(300)
    },
    pay_status:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    prepare_status:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cutlery:{
      type:Sequelize.TINYINT,
      allowNull: false
    },
    opt1:{
        type: Sequelize.STRING(300)
    }
    ,
    opt2:{
        type: Sequelize.STRING(300)
    }
    ,
    opt3:{
        type: Sequelize.STRING(300)
    }
    ,
    opt4:{
        type: Sequelize.STRING(300)
    }
    ,
    opt5:{
        type: Sequelize.STRING(300)
    },
    total_amount:{
      type: Sequelize.INTEGER,
    }
});

module.exports = Historyorders;
