// order_items.js
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート

const OrderItems = database.define('OrderItems', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'menu',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    options: {
        type: DataTypes.JSON,
        allowNull: true
    },
    item_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_items',
    timestamps: false
});

module.exports = OrderItems;
