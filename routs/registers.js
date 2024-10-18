const { DataTypes } = require('sequelize');
const database = require('../../order_db');

const Register = database.define('Register', {
    register_id: {
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
    open_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    close_amount: {
        type: DataTypes.DECIMAL(10, 2)
    },
    status: {
        type: DataTypes.ENUM('open', 'close'),  // オープンとクローズの状態を表すフラグ
        defaultValue: 'open'
    },
    remarks: {
        type: DataTypes.STRING(255)
    },
    bill_10000: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bill_5000: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bill_1000: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coin_500: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coin_100: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coin_50: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coin_10: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coin_5: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coin_1: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    open_time: {  // open_time を追加
        type: DataTypes.DATE,
        allowNull: true
    },
    close_time: {  // open_time を追加
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'registers',
    timestamps: false
});

module.exports = Register;
