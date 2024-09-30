const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../posdb');  // データベース接続をインポート

const PosUser = database.define('PosUser', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    login_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'active'
    },
    language: {
        type: DataTypes.ENUM('pt', 'en', 'ja'),
        allowNull: false,
        defaultValue: 'pt'  // デフォルト値を設定
    },
    representative_name: {
        type: DataTypes.STRING(255),
        allowNull: true,  // 代表名は必須ではないので allowNull: true とする
    },
    expenses_get_id: {
        type: DataTypes.INTEGER,
        allowNull: true,  // このフィールドはNULLを許可する
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'User',  // テーブル名を指定
    timestamps: false  // 自動で createdAt と updatedAt を追加しない
});

module.exports = PosUser;
