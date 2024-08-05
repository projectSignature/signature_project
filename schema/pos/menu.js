const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../posdb');  // データベース接続をインポート

const Menu = database.define('Menu', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    menu_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    item_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'Menu',  // テーブル名を指定
    timestamps: false  // 自動で createdAt と updatedAt を追加しない
});

module.exports = Menu;
