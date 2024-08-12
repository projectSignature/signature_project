const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート

const Option = database.define('Option', {
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
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'menu',
            key: 'id'
        }
    },
    option_name_pt: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    option_name_en: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    option_name_ja: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    additional_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    }
}, {
    tableName: 'option',
    timestamps: false
});

module.exports = Option;
