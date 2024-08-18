const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../posdb');  // データベース接続をインポート

const RegisterOpenClose = database.define('RegisterOpenClose', {
    register_open_close_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    register_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cashier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    open_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    close_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    cash_opening_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    other_opening_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    cash_closing_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    other_closing_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    }
}, {
    tableName: 'RegisterOpenClose',
    timestamps: true,  // `timestamps` を有効化
    createdAt: 'created_at',  // フィールド名を指定
    updatedAt: 'updated_at'   // フィールド名を指定
});


module.exports = RegisterOpenClose;
