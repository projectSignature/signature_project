const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  

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
            model: 'orders_ver2',
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
    },
    coupon_printed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    serve_status: {  // 新しいカラム
        type: DataTypes.ENUM('pending', 'in_progress', 'served'),  // 提供状況を列挙型で管理
        allowNull: false,
        defaultValue: 'pending'  // デフォルトは未提供
    }
}, {
    tableName: 'order_items_ver2',
    timestamps: false
});

module.exports = OrderItems;
