// orders.js
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート
const OrderItems = require('./order_items'); // OrderItemsモデルをインポート

const Orders = database.define('Orders', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    table_no: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    order_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    order_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'orders',
    timestamps: false
});

Orders.hasMany(OrderItems, { foreignKey: 'order_id' });
OrderItems.belongsTo(Orders, { foreignKey: 'order_id' });

module.exports = Orders;
