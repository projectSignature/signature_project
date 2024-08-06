const { DataTypes } = require('sequelize');
const sequelize = require('../../chats_db'); // Sequelizeインスタンスをインポート

const Message = sequelize.define('Message', {
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'messages', // テーブル名を指定（オプション）
    timestamps: false // createdAtやupdatedAtのカラムを無効にする（オプション）
});

module.exports = Message;
