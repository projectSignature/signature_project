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
    },
    bbq_kubun: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    display_number:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    zairyo: {
      type: Sequelize.STRING(500),
    },
    zairyoqt: {
      type: Sequelize.STRING(500),
    },
    zairyotp: {
      type: Sequelize.STRING(500),
    },
    option1:{
      type:Sequelize.TINYINT,
      allowNull:false
    },
    option2:{
      type:Sequelize.TINYINT,
      allowNull:false
    },
    option3:{
      type:Sequelize.TINYINT,
      allowNull:false
    },
    option4:{
      type:Sequelize.TINYINT,
      allowNull:false
    },
    detail_pt:{
        type: Sequelize.STRING(1000),
    },
    detail_en:{
        type: Sequelize.STRING(1000),
    },
    detail_jp:{
        type: Sequelize.STRING(1000),
    },
    use_id:{
      type: Sequelize.STRING(1000),
    },
    use_qt:{
      type: Sequelize.STRING(1000),
    }
});

module.exports = RestMenus;
