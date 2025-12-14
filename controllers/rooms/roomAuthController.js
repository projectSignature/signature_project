const jwt = require('jsonwebtoken');
const Users = require("../../schema/roomSync/users");
const SECRET = 'roomsync_secret_key';       // ← 必要なら環境変数に
const bcrypt = require("bcrypt");


exports.login = async (req, res) => {
  try {
    console.log(`req.body`, req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: "入力不足" });
    }

    const user = await Users.findOne({ where: { username } });
    if (!user) {
      return res.json({ success: false, message: "ユーザーが存在しません" });
    }

    // ★ bcrypt で照合する（重要）
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "パスワード不一致" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      },
      SECRET,
      { expiresIn: '24h' }
    );

    const loginCount = user.login_count || 0;
    await user.update({ login_count: loginCount + 1 });

    res.json({
      success: true,
      token,
      name: user.name,
      login_count: loginCount,
      hotelId :user.hotel_id
    });

  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ success: false, message: "サーバーエラー" });
  }
};
