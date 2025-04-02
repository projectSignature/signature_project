const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート

const User = database.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    table_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0  // レストランのテーブル数
    },
    language: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'en'
    },
    role: {
        type: DataTypes.ENUM('admin', 'operator', 'other', 'dine_in', 'takeout'),
        allowNull: false,
        defaultValue: 'operator'
    },
    uber_enabled: {
        type: DataTypes.BOOLEAN,  // true/false フラグ
        allowNull: false,
        defaultValue: false  // デフォルトで無効
    },
    takeout_enabled: {
        type: DataTypes.BOOLEAN,  // true/false フラグ
        allowNull: false,
        defaultValue: false  // デフォルトで無効
    },
    tax_type: {
        type: DataTypes.ENUM('inclusive', 'exclusive'), // 内税か外税か
        allowNull: false,
        defaultValue: 'exclusive'
    },
    invoice_number: {
        type: DataTypes.STRING(50),  // インボイス番号
        allowNull: true
    },
    receipt_address: {  // レシート用住所
        type: DataTypes.STRING(255),
        allowNull: true
    },
    receipt_display_name: {  // レシート用表示名
        type: DataTypes.STRING(100),
        allowNull: true
    },
    receipt_tel: {  // レシート用TEL
        type: DataTypes.STRING(15),
        allowNull: true
    },
    receipt_postal_code: {  // レシート用郵便番号
        type: DataTypes.STRING(10),
        allowNull: true
    },
    receipt_fax: {  // レシート用FAX番号
        type: DataTypes.STRING(15),
        allowNull: true
    },
    receipt_logo_url: {  // レシート用ロゴ画像URL
        type: DataTypes.STRING(255),
        allowNull: true
    },
    instagram_url: {  // Instagram URL
        type: DataTypes.STRING(255),
        allowNull: true
    },
    facebook_url: {  // Facebook URL
        type: DataTypes.STRING(255),
        allowNull: true
    },
    restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',  // 同じテーブルを参照
            key: 'id'
        }
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
