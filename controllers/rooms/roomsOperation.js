
// controller/rooms/roomsOperation.js
const Room = require('../../schema/roomSync/Rooms');
const AmenityRequest = require('../../schema/roomSync/AmenityRequests');

/**
 * GET /room/status?hotel_id=1
 * 指定ホテルの全ルームステータスを取得
 */
exports.getRoomStatus = async (req, res) => {
  try {
    const { hotel_id } = req.query;

    console.log(req.query)

    if (!hotel_id) {
      return res.status(400).json({ error: 'hotel_id is required' });
    }

    // hotel_id で部屋を検索
    const rooms = await Room.findAll({
      where: { hotel_id },
      attributes: [
        'id',
        'room_number',
        'floor',
        'room_type',
        'status',
        'guest_name',
'guest_count',
'checkout_time',
        'last_cleaned',
        'notes',
        'cleaning_price',
        'updated_at',
        "stay_type",
        "checkout_status"
      ],
      order: [['floor', 'ASC'], ['room_number', 'ASC']]
    });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found for this hotel_id' });
    }

    return res.json({
      hotel_id,
      count: rooms.length,
      rooms
    });

  } catch (error) {
    console.error('❌ Error fetching room status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ 部屋ステータス更新
exports.updateRoomStatus = async (req, res) => {
  try {
    const { room_id, status } = req.body;
    if (!room_id || !status)
      return res.status(400).json({ error: "room_id と status は必須です。" });

    // DB更新
    const [updated] = await Room.update(
      { status, updated_at: new Date() },
      { where: { id: room_id } }
    );

    if (updated === 0) {
      return res.status(404).json({ error: "対象の部屋が見つかりません。" });
    }

    res.json({ success: true, message: "部屋ステータスを更新しました。" });
  } catch (err) {
    console.error("❌ updateRoomStatus error:", err);
    res.status(500).json({ error: "サーバーエラー" });
  }
};

// 🔹 アメニティ依頼登録
exports.registerAmenityAction = async (req, res) => {
  try {
    const { room_id, action_type, amenity, return_to } = req.body;
    if (!room_id || !action_type || !amenity) {
      return res.status(400).json({
        success: false,
        error: "room_id, action_type, amenity は必須です。"
      });
    }

    // 「補充」以外のときだけ return_to を必須にする
    if ((action_type === "交換" || action_type === "回収") && !return_to) {
      return res.status(400).json({
        success: false,
        error: "交換・回収のときは return_to が必須です。"
      });
    }


    const newRequest = await AmenityRequest.create({
      room_id,
      action_type,
      amenity,
      return_to,
      status: 'pending'
    });

    res.json({ success: true, message: "アメニティ依頼を登録しました。", request: newRequest });
  } catch (err) {
    console.error("❌ registerAmenityAction error:", err);
    res.status(500).json({ error: "サーバーエラー" });
  }
};

// 🔹 全アメニティ依頼取得（スタッフ画面用）
exports.getAmenityRequests = async (req, res) => {
  try {
    const requests = await AmenityRequest.findAll({
      include: [
        {
          model: Room,
          attributes: ['room_number', 'floor', 'room_type'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // JOIN結果を整形
    const formatted = requests.map((r) => ({
      id: r.id,
      room_id: r.room_id,
      room_number: r.Room ? r.Room.room_number : '-',
      floor: r.Room ? r.Room.floor : null,
      room_type: r.Room ? r.Room.room_type : null,
      amenity: r.amenity,
      action_type: r.action_type,
      return_to: r.return_to,
      status: r.status,
      created_at: r.created_at,
    }));

    res.json({ success: true, requests: formatted });
  } catch (err) {
    console.error('❌ getAmenityRequests error:', err);
    res.status(500).json({ success: false, error: 'サーバーエラー（一覧取得）' });
  }
};


// 🔹 完了処理（削除 or ステータス変更）
exports.completeAmenityRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "id は必須です。" });

    // 削除方式：
    const deleted = await AmenityRequest.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ error: "対象の依頼が見つかりません。" });
    }

    res.json({ success: true, message: "依頼を完了しました（削除済）" });
  } catch (err) {
    console.error("❌ completeAmenityRequest error:", err);
    res.status(500).json({ error: "サーバーエラー" });
  }
};

// controllers/rooms/roomsOperation.js
exports.updateRoomDetails = async (req, res) => {
  try {
    const { id, guest_name, guest_count, checkout_time, notes } = req.body;
    console.log(req.body)
    await Room.update(
      { guest_name, guest_count, checkout_time, notes },
      { where: { id } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("❌ 部屋詳細更新エラー:", err);
    res.status(500).json({ error: "更新失敗" });
  }
};


// ====================================================
// 🟢 アメニティ依頼一覧取得
// ====================================================
exports.getAmenityRequests = async (req, res) => {
  try {
    const requests = await AmenityRequest.findAll({
      include: [
        {
          model: Room,
          attributes: ['room_number'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // RoomをJOINしてroom_numberを付与
    const formatted = requests.map((r) => ({
      id: r.id,
      room_id: r.room_id,
      room_number: r.Room ? r.Room.room_number : '-',
      amenity: r.amenity,
      action_type: r.action_type,
      return_to: r.return_to,
      status: r.status,
      created_at: r.created_at,
    }));

    res.json({ success: true, requests: formatted });
  } catch (err) {
    console.error('❌ getAmenityRequests error:', err);
    res.status(500).json({ success: false, error: 'サーバーエラー（一覧取得）' });
  }
};

// ====================================================
// 🟢 アメニティ依頼登録
// ====================================================
exports.registerAmenityAction = async (req, res) => {
  try {
    const { room_id, amenity, action_type, return_to } = req.body;

    // 補充は return_to が不要
    if (!room_id || !action_type || !amenity) {
      return res
        .status(400)
        .json({ success: false, error: 'room_id, action_type, amenity は必須です。' });
    }
    if (action_type !== '補充' && !return_to) {
      return res
        .status(400)
        .json({ success: false, error: '返却先が必要です。' });
    }

    await AmenityRequest.create({
      room_id,
      amenity,
      action_type,
      return_to: action_type === '補充' ? null : return_to,
      status: 'pending',
      created_at: new Date(),
    });

    res.json({ success: true, message: 'アメニティ依頼を登録しました。' });
  } catch (err) {
    console.error('❌ registerAmenityAction error:', err);
    res.status(500).json({ success: false, error: 'サーバーエラー（登録）' });
  }
};

// ====================================================
// 🟢 アメニティ依頼完了（削除）
// ====================================================
exports.completeAmenityRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'id は必須です。' });
    }

    const deleted = await AmenityRequest.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ success: false, error: '指定された依頼が存在しません。' });
    }

    res.json({ success: true, message: '依頼を完了しました。' });
  } catch (err) {
    console.error('❌ completeAmenityRequest error:', err);
    res.status(500).json({ success: false, error: 'サーバーエラー（削除）' });
  }
};

// ====================================================
// 🟢 宿泊人数（guest_count）更新（hotel_id対応版）
// ====================================================
exports.updateGuestCount = async (req, res) => {
  try {
    const { id } = req.params;               // URLパラメータ
    const { hotel_id, guest_count } = req.body;  // JSONボディ
console.log(req.body)
console.log('人数変更')
    if (!id) {
      return res.status(400).json({ success: false, error: "id は必須です。" });
    }
    if (!hotel_id) {
      return res.status(400).json({ success: false, error: "hotel_id は必須です。" });
    }
    if (guest_count === undefined || guest_count === null) {
      return res.status(400).json({ success: false, error: "guest_count が未指定です。" });
    }

    // 対象ホテル＆部屋を特定して更新
    const [updated] = await Room.update(
      { guest_count, updated_at: new Date() },
      { where: { id, hotel_id } }
    );

    if (updated === 0) {
      return res.status(404).json({ success: false, error: "対象の部屋が見つかりません。" });
    }

    res.json({
      success: true,
      message: `ホテルID:${hotel_id} 部屋ID:${id} の人数を ${guest_count} に更新しました。`,
    });
  } catch (err) {
    console.error("❌ updateGuestCount error:", err);
    res.status(500).json({ success: false, error: "サーバーエラー（人数更新）" });
  }
};

// ====================================================
// 🟢 グループ／個別（stay_type）切り替え
// ====================================================
exports.updateStayType = async (req, res) => {
  try {
    const { id } = req.params;
    const { hotel_id } = req.body;

    if (!id) return res.status(400).json({ success: false, error: "id は必須です。" });
    if (!hotel_id) return res.status(400).json({ success: false, error: "hotel_id は必須です。" });

    // 現在のstay_typeを取得
    const room = await Room.findOne({ where: { id, hotel_id } });
    if (!room) return res.status(404).json({ success: false, error: "部屋が見つかりません。" });

    const newType = room.stay_type === "group" ? "individual" : "group";

    await Room.update(
      { stay_type: newType, updated_at: new Date() },
      { where: { id, hotel_id } }
    );

    res.json({
      success: true,
      newType,
      message: `部屋ID:${id} の宿泊タイプを '${newType}' に変更しました。`,
    });
  } catch (err) {
    console.error("❌ updateStayType error:", err);
    res.status(500).json({ success: false, error: "サーバーエラー（宿泊タイプ切替）" });
  }
};

// ====================================================
// 🟢 チェックアウトステータス切替（before/after）
// ====================================================
exports.updateCheckoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { hotel_id } = req.body;

    if (!id) return res.status(400).json({ success: false, error: "id は必須です。" });
    if (!hotel_id) return res.status(400).json({ success: false, error: "hotel_id は必須です。" });

    const room = await Room.findOne({ where: { id, hotel_id } });
    if (!room) return res.status(404).json({ success: false, error: "部屋が見つかりません。" });

    const newStatus = room.checkout_status === "after" ? "before" : "after";

    await Room.update(
      { checkout_status: newStatus, updated_at: new Date() },
      { where: { id, hotel_id } }
    );

    res.json({
      success: true,
      newStatus,
      message: `部屋ID:${id} のチェックアウト状態を '${newStatus}' に変更しました。`,
    });
  } catch (err) {
    console.error("❌ updateCheckoutStatus error:", err);
    res.status(500).json({ success: false, error: "サーバーエラー（チェックアウト切替）" });
  }
};

exports.bulkUpdateRoomStatus = async (req, res) => {
  const t = await Room.sequelize.transaction();

  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ success: false, error: "更新データが空です。" });
    }

    // === 1️⃣ 一括CASE UPDATE ===
    // 例: UPDATE Rooms SET status = CASE id WHEN 1 THEN 'clean' WHEN 2 THEN 'need_clean' END WHERE id IN (1,2);
    const ids = updates.map((u) => u.room_id);
    const caseParts = updates
      .map((u) => `WHEN ${u.room_id} THEN '${u.status}'`)
      .join(" ");

    const sql = `
      UPDATE Rooms
      SET status = CASE id
        ${caseParts}
      END,
      updated_at = NOW()
      WHERE id IN (${ids.join(",")});
    `;

    await Room.sequelize.query(sql, { transaction: t });

    // === 2️⃣ 全件更新 ===
    await Room.update(
      {
        checkout_status: "before",
        stay_type: "group",
        updated_at: new Date(),
      },
      { where: {}, transaction: t }
    );

    await t.commit();
    res.json({ success: true, updated: updates.length });
  } catch (err) {
    await t.rollback();
    console.error("❌ bulkUpdateRoomStatus error:", err);
    res.status(500).json({ success: false, error: "一括更新失敗" });
  }
};



