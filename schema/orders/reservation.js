const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート

const Reservation = database.define('Reservation', {
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
            model: 'users',  // usersテーブルを参照
            key: 'id'
        }
    },
    reservation_date: {
        type: DataTypes.DATEONLY,  // 予約日
        allowNull: false
    },
    reservation_start_time: {
        type: DataTypes.TIME,  // 予約開始時間
        allowNull: false
    },
    reservation_end_time: {
        type: DataTypes.TIME,  // 予約終了時間
        allowNull: false
    },
    table_number: {
        type: DataTypes.INTEGER,  // テーブル番号
        allowNull: false
    },
    reservation_name: {
        type: DataTypes.STRING(255),  // 予約者名
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(15),  // 電話番号
        allowNull: false
    },
    num_people: {
        type: DataTypes.INTEGER,  // 予約人数
        allowNull: false
    },
    remarks: {
        type: DataTypes.TEXT,  // 備考欄（フリーテキスト）
        allowNull: true  // 任意
    }
}, {
    tableName: 'reservations',
    timestamps: false
});

module.exports = Reservation;
