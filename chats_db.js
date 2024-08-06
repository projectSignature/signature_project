const Sequelize = require('sequelize');
const sequelize = new Sequelize('chat_app', 'doadmin', 'AVNS_HzTD1mdcLG5r73POOIr', {
    dialect: 'mysql',
    host: 'db-mysql-nyc1-46829-do-user-12541529-0.b.db.ondigitalocean.com',
    port: 25060
});

module.exports = sequelize;
