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
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    transaction_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    item_details: {
        type: DataTypes.JSON,  // アイテムの詳細をJSONとして保存
        allowNull: false,
    },
    tax_rate: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00  // デフォルト値を0.00に設定
    },
    register_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cashier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    pay_type: {
        type: DataTypes.ENUM('cash', 'credit', 'other','online'),  // ENUM型で選択肢を指定
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
