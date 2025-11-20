const { DataTypes } = require("sequelize");
const database = require("../../roomSync");

const User = database.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "staff",
  },

  /* 🔵 NEW: 契約区分 */
  contract_type: {
    type: DataTypes.STRING(20),   // “baito”, “fulltime”
    allowNull: false,
    defaultValue: "baito"
  },

  /* 🔵 NEW: 言語設定（ユーザーが使うUI言語） */
  language: {
    type: DataTypes.STRING(10),   // “pt”, “jp”, “en”
    allowNull: false,
    defaultValue: "pt"
  },

  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  login_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: "users",
  timestamps: false
});


module.exports = User;
