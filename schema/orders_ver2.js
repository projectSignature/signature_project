const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート
const OrderItems = require('./order_items_ver2'); // OrderItemsモデルをインポート

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
        type: DataTypes.ENUM('yet', 'pending', 'prepared', 'confirmed', 'cancelled'), // 'prepared'を追加
        defaultValue: 'pending'
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'credit', 'other', 'yet'),
        defaultValue: 'yet'
    },
    coupon_printed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    alarm_enabled: {  // アラームON/OFFカラムを追加
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true  // デフォルトではON
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    pickup_time: {  // 引き取り時間カラムを追加
        type: DataTypes.DATE,
        allowNull: true  // デフォルト値なし
    },
    order_type: {  // 新しい order_type カラムを追加
        type: DataTypes.ENUM('local', 'takeout', 'uber', 'demaekan', 'other'),
        defaultValue: 'local'
    }
}, {
    tableName: 'orders_ver2',
    timestamps: false
});

// database.sync({ alter: true })  // データベースとモデルを同期する
//   .then(() => {
//     console.log("Database synchronized with the model.");
//
//     // サーバーを起動
//     app.listen(3000, () => {
//       console.log('Server is running on port 3000');
//     });
//   })
//   .catch(error => {
//     console.error("Error synchronizing the database:", error);
//   });

Orders.hasMany(OrderItems, { foreignKey: 'order_id' });
OrderItems.belongsTo(Orders, { foreignKey: 'order_id' });

module.exports = Orders;
