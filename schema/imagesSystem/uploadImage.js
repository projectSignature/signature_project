const { DataTypes } = require('sequelize');
const sequelize = require('../../imageUpload_db');  // データベース接続をインポート

const ImageUpload = sequelize.define('ImageUpload', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY, // 日付のみ
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'ImageUpload', // テーブル名
    timestamps: true, // createdAtとupdatedAtを自動管理
});

module.exports = ImageUpload;
