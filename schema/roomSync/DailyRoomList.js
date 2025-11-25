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
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    guest_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    // 🔹 追加分
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
  },
  {
    tableName: "daily_room_list",
    timestamps: false,
  }
);

module.exports = DailyRoomList;
