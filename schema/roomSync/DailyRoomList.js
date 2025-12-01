const { DataTypes } = require("sequelize");
const database = require("../../roomSync"); // DB接続

const DailyRoomList = database.define(
  "DailyRoomList",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    work_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    room_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // ⭐ floor を追加
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    guest_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    sub_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    amenity_only: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    open_flag: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },

    checked_flag: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },

    amenity_complete_flag: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },

    checkout_status:{
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'before', // 'before' or 'after'
      comment: 'チェックアウト状態（before=チェックアウト前, after=チェックアウト後）'
    },

    assigned_staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    cleaned_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    cleaning_done_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    checked_done_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    checkout_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    is_edited: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },

    edit_history: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    stay_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "daily_room_list",
    timestamps: false,
  }
);

module.exports = DailyRoomList;
