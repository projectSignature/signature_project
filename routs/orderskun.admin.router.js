const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const OrdersUser = require('../schema/orders/user');
const { encryptPassword } = require('../libs/encypt/password-crypto');

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'abracadabra';
const PROFILE_FIELDS = [
  'receipt_display_name',
  'receipt_postal_code',
  'receipt_address',
  'receipt_tel',
  'receipt_fax',
  'invoice_number',
  'instagram_url',
  'facebook_url'
];

function groupWhere(restaurantId) {
  return {
    [Op.or]: [
      { id: restaurantId },
      { restaurant_id: restaurantId }
    ]
  };
}

async function requireRestaurantAdmin(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, message: 'ログインが必要です' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUser = await OrdersUser.findByPk(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: '管理者権限が必要です' });
    }

    const restaurantId = Number(adminUser.restaurant_id || adminUser.id);
    if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
      return res.status(403).json({ success: false, message: '店舗情報を確認できません' });
    }

    req.ordersAdmin = { adminUser, restaurantId };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'ログインの有効期限が切れています' });
  }
}

router.use(requireRestaurantAdmin);

router.get('/accounts', async (req, res) => {
  try {
    const users = await OrdersUser.findAll({
      where: groupWhere(req.ordersAdmin.restaurantId),
      attributes: ['id', 'username', 'email', 'role', 'language', 'restaurant_id', 'created_at'],
      order: [['role', 'ASC'], ['id', 'ASC']]
    });
    return res.json({ success: true, restaurant_id: req.ordersAdmin.restaurantId, accounts: users });
  } catch (error) {
    console.error('Failed to list restaurant accounts:', error);
    return res.status(500).json({ success: false, message: 'アカウント一覧を取得できませんでした' });
  }
});

router.patch('/accounts/:id/password', async (req, res) => {
  try {
    const accountId = Number(req.params.id);
    const password = String(req.body.password || '');
    const passwordConfirmation = String(req.body.password_confirmation || '');

    if (!Number.isInteger(accountId) || accountId <= 0) {
      return res.status(400).json({ success: false, message: 'アカウントIDが正しくありません' });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ success: false, message: 'パスワードは8文字以上72文字以下にしてください' });
    }
    if (password !== passwordConfirmation) {
      return res.status(400).json({ success: false, message: '確認用パスワードが一致しません' });
    }

    const account = await OrdersUser.findOne({
      where: { id: accountId, ...groupWhere(req.ordersAdmin.restaurantId) }
    });
    if (!account) return res.status(404).json({ success: false, message: '対象アカウントが見つかりません' });

    account.password = await encryptPassword(password);
    await account.save();
    return res.json({ success: true, message: `${account.username}のパスワードを変更しました` });
  } catch (error) {
    console.error('Failed to reset restaurant account password:', error);
    return res.status(500).json({ success: false, message: 'パスワードを変更できませんでした' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const restaurantId = req.ordersAdmin.restaurantId;
    const owner = await OrdersUser.findByPk(restaurantId) || req.ordersAdmin.adminUser;
    const profile = { restaurant_id: restaurantId };
    PROFILE_FIELDS.forEach((field) => { profile[field] = owner[field] || ''; });
    return res.json({ success: true, profile });
  } catch (error) {
    console.error('Failed to get restaurant profile:', error);
    return res.status(500).json({ success: false, message: '店舗情報を取得できませんでした' });
  }
});

router.patch('/profile', async (req, res) => {
  try {
    const values = {};
    PROFILE_FIELDS.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        values[field] = String(req.body[field] == null ? '' : req.body[field]).trim().slice(0, 255) || null;
      }
    });
    if (!Object.keys(values).length) {
      return res.status(400).json({ success: false, message: '更新する店舗情報がありません' });
    }

    await OrdersUser.update(values, { where: groupWhere(req.ordersAdmin.restaurantId) });
    return res.json({ success: true, message: '店舗情報を更新しました', profile: values });
  } catch (error) {
    console.error('Failed to update restaurant profile:', error);
    return res.status(500).json({ success: false, message: '店舗情報を更新できませんでした' });
  }
});

module.exports = router;
