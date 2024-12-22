const Sequelize = require('sequelize');
const sequelize = new Sequelize('image_kakunou', 'doadmin', 'AVNS_HzTD1mdcLG5r73POOIr', {
    dialect: 'mysql',
    host: 'db-mysql-nyc1-46829-do-user-12541529-0.b.db.ondigitalocean.com',
    port: 25060
});

// const sequelize = new Sequelize('order_db', 'root', '12345678', {
//     dialect: 'mysql',
//     host: '127.0.0.1',
//     port: 3306
// });


module.exports = sequelize;
