const Sequelize = require('sequelize');
const database = require('../../registerDb');

const Category = database.define('m_categories', {
    category_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    category_name_en: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    category_name_ja: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    category_name_pt: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    description: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    icon_number: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    category_type: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    identification_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'user_categories',
            key: 'category_id'
        }
    }
}, {
    timestamps: false
});

module.exports = Category;
