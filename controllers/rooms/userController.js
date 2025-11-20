// controllers/users/userController.js
const User = require("../../schema/roomSync/users");
const bcrypt = require("bcryptjs");


exports.createUser = async (req, res) => {
  try {
    const { username, password, name, role, hotel_id, contract_type, language } = req.body;

    if (!username || !password || !name || !role || !hotel_id) {
      return res.status(400).json({
        success: false,
        error: "username, password, name, role, hotel_id são obrigatórios."
      });
    }

    // username 重複チェック
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Este username já está em uso."
      });
    }

    // 🔒 パスワードをハッシュ化
    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashed,
      name,
      role,
      hotel_id,
      contract_type: contract_type || "baito",
      language: language || "pt",
      login_count: 0
    });

    res.json({ success: true, message: "Usuário criado com sucesso.", user: newUser });

  } catch (err) {
    console.error("❌ createUser error:", err);
    res.status(500).json({ success: false, error: "Erro no servidor." });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { username, newName, newPassword, newRole, newContract, newLanguage } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "username é obrigatório."
      });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado."
      });
    }

    if (newName) user.name = newName;
    if (newRole) user.role = newRole;
    if (newContract) user.contract_type = newContract;
    if (newLanguage) user.language = newLanguage;

    // 🔒 新しいパスワードはハッシュ化
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({ success: true, message: "Usuário atualizado.", user });

  } catch (err) {
    console.error("❌ updateUser error:", err);
    res.status(500).json({ success: false, error: "Erro no servidor." });
  }
};




exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "username é obrigatório."
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado."
      });
    }

    await user.destroy();

    res.json({ success: true, message: "Usuário excluído." });

  } catch (err) {
    console.error("❌ deleteUser error:", err);
    res.status(500).json({ success: false, error: "Erro no servidor." });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "name", "role", "hotel_id", "login_count", "last_login"]
    });

    res.json({ success: true, users });

  } catch (err) {
    console.error("❌ getAllUsers error:", err);
    res.status(500).json({ success: false, error: "Erro no servidor." });
  }
};


exports.getUserList = async (req, res) => {
  try {
    const hotel_id = req.query.hotel_id;

    const users = await User.findAll({
      where: { hotel_id },
      attributes: ["username", "name", "role", "contract_type", "language"]
    });

    res.json({ success: true, users });
  } catch (err) {
    console.error("❌ getUserList error:", err);
    res.status(500).json({ success: false, error: "Erro no servidor." });
  }
};
