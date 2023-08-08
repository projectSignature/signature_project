const Sequelize = require('sequelize');
const database = require('../db');

const CloseCaixas = database.define('closecaixa', {
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
    p_day: {
      type: Sequelize.STRING(45),
      unique: false,
    },
    crete_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    finel_id:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    start:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    uber:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    squere:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    demae:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    final:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    obs:{
      type: Sequelize.STRING(100),
      unique: false,
    }
});

module.exports = CloseCaixas;
