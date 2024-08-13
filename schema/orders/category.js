const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート

const Category = database.define('Category', {
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
        type: DataTypes.STRING(255),
        allowNull: false
    },
    category_name_pt: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    category_name_en: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    category_name_ja: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    printer_ip: {
        type: DataTypes.STRING(15),  // IPアドレスの文字列形式
        allowNull: true  // プリンターIPが設定されない場合もあるため、NULLを許可
    }
},
{
    tableName: 'category',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'category_id']
        }
    ]
});

module.exports = Category;
