const { DataTypes } = require('sequelize');
const database = require('../../roomSync'); // ← DB接続設定に合わせて変更

const Room = database.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  room_number: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  room_type: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '部屋タイプ（SM, TM, TD, etc）'
  },
  cleaning_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: '清掃単価（円）'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'unused', // ← 初期値を「未使用」に変更
    comment: '部屋状態（checked, stay_clean, stay_noclean, need_clean, unused）'
  },
  last_cleaned: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最終清掃日'
  },
  checkout_status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'before', // 'before' or 'after'
    comment: 'チェックアウト状態（before=チェックアウト前, after=チェックアウト後）'
  },

  // ===============================
  // 🏨 追加：詳細情報カラム
  // ===============================
  guest_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '宿泊者名'
  },
  checkout_time: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'チェックアウト予定時刻'
  },
  guest_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '宿泊人数'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '備考欄（メモやリクエスト）'
  },

  // ===============================
  // 🧍‍♀️👥 個人 or 団体管理カラム
  // ===============================
  stay_type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'individual', // 'individual' or 'group'
    comment: '宿泊タイプ（individual=個人, group=団体）'
  },

  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'rooms',
  timestamps: false
});

module.exports = Room;
