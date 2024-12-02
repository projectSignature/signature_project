const Sequelize = require('sequelize');
const database = require('../../registerDb');

const UserCategory = database.define('user_categories', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'm_categories',
            key: 'identification_id'
        },
        onDelete: 'CASCADE'
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    type_data:{
      type: Sequelize.INTEGER,
      allowNull: false
    }
}, {
    timestamps: false
});

module.exports = UserCategory;
