const sequelize = require('sequelize')
const { DataTypes } = require('sequelize')
const database = require('../../registerDb')

const KeiriUsers = database.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    username: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    password: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    language: {
        type: DataTypes.STRING(10),
        allowNull: false
    },

    phoneNumber: {
        field: 'phone_number',
        type: DataTypes.STRING(10),
        allowNull: true
    },

    categoryNumber: {
        field: 'category_number',
        type: DataTypes.STRING(10),
        allowNull: true
    },

    paymentStatus: {
        field: 'payment_status',
        type: DataTypes.BOOLEAN,
        allowNull: true
    },

    invoiceNumber: {
        field: 'invoice_number',
        type: DataTypes.STRING(50),
        allowNull: true
    },

    companyName: {
        field: 'company_name',
        type: DataTypes.STRING(100),
        allowNull: true
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
        allowNull: false
    },

    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
        allowNull: false
    }
});

module.exports = KeiriUsers;
