const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../posdb');  // データベース接続をインポート


const Sale = database.define('Sale', {
    sale_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    register_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cashier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    transaction_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    pay_type: {
        type: DataTypes.ENUM('cash', 'credit', 'other'),  // ENUM型で選択肢を指定
        allowNull: false,
        defaultValue: 'cash'  // デフォルト値を指定
    }
}, {
    tableName: 'Sales',  // テーブル名を指定
    timestamps: true,  // `timestamps` を有効化
    createdAt: 'created_at',  // フィールド名を指定
    updatedAt: 'updated_at'   // フィールド名を指定
});


module.exports = Sale;
