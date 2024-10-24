const { DataTypes } = require('sequelize');
const database = require('../../order_db');  // データベース接続をインポート


const CategoryHours = database.define('CategoryHours', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Category', // Categoryテーブルとリレーションを設定
            key: 'id'
        },
        onDelete: 'CASCADE'  // カテゴリが削除されたらこのレコードも削除
    },
    day_of_week: {
        type: DataTypes.ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,  // 開始時間
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,  // 終了時間
        allowNull: false
    }
}, {
    tableName: 'category_hours',
    timestamps: false
});



module.exports = CategoryHours;
