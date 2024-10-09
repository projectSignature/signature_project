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
    item_name_jp: {  // 日本語のアイテム名
        type: DataTypes.STRING(255),
        allowNull: true  // 必須ではない場合は allowNull: true にする
    },
    category: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    category_jp: {  // 日本語のカテゴリ名
        type: DataTypes.STRING(255),
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    unit: {  // 新しく単位を管理するカラムを追加
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'kg'  // デフォルトの単位を 'peça' に設定
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isVisible: {  // 表示・非表示を管理するカラムを追加
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true  // デフォルトで表示されるように設定
    }
}, {
    tableName: 'Menu',  // テーブル名を指定
    timestamps: false  // 自動で createdAt と updatedAt を追加しない
});

module.exports = Menu;
