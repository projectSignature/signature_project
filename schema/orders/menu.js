const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート

const Menu = database.define('Menu', {
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
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id'
        }
    },
    menu_name_pt: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    menu_name_en: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    menu_name_ja: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description_pt: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description_en: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description_ja: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stock_status: {  // 新しいカラムを追加
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'menu',
    timestamps: false
});

module.exports = Menu;
