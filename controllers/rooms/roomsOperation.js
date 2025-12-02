
// controller/rooms/roomsOperation.js
const Room = require('../../schema/roomSync/Rooms');
const AmenityRequest = require('../../schema/roomSync/AmenityRequests');
const DailyRoomList = require("../../schema/roomSync/DailyRoomList");

/**
 * GET /room/status?hotel_id=1
 * 指定ホテルの全ルームステータスを取得
 */
 exports.getRoomStatus = async (req, res) => {
   try {
     const { hotel_id } = req.query;

     console.log(req.query);

     if (!hotel_id) {
       return res.status(400).json({ error: 'hotel_id is required' });
     }

     // 全カラム返す → attributes を削除
     const rooms = await Room.findAll({
       where: { hotel_id },
       order: [
         ['floor', 'ASC'],
         ['room_number', 'ASC']
       ]
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

    // ------------------------------
    // 1回のUPDATEでまとめる
    // ------------------------------
    const [updated] = await Room.update(
      {
        status,
        excel_status: status === "stay_clean" ? "S" : undefined,
        updated_at: new Date(),
      },
      {
        where: { id: room_id },
        // excel_status を undefined のとき更新しないための設定
        fields: ["status", "updated_at", ...(status === "stay_clean" ? ["excel_status"] : [])]
      }
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


exports.updateRoomStatusForCheckOutAfter = async (req, res) => {
  try {
    const { room_id, status } = req.body;
    if (!room_id || !status)
      return res.status(400).json({ error: "room_id と status は必須です。" });

    // DB更新
    const [updated] = await Room.update(
      { checkout_status:'after', updated_at: new Date() },
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

exports.updateRoomStatusSingleGuest = async (req, res) => {
  try {
    const { room_id, status } = req.body;
    if (!room_id || !status)
      return res.status(400).json({ error: "room_id と status は必須です。" });

    // DB更新
    const [updated] = await Room.update(
      { stay_type:status, updated_at: new Date() },
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
    const { hotel_id,status } = req.body;
    console.log('room to checkOut')
    console.log(req.body)

    if (!id) return res.status(400).json({ success: false, error: "id は必須です。" });
    if (!hotel_id) return res.status(400).json({ success: false, error: "hotel_id は必須です。" });

    const room = await Room.findOne({ where: { id, hotel_id } });
    if (!room) return res.status(404).json({ success: false, error: "部屋が見つかりません。" });

    // 🔄 チェックアウト状態の切り替え
    const newStatus = room.checkout_status === "after" ? "before" : "after";

    // 🧽 after → つまり「チェックアウトされた」場合は清掃要へ
    const updateFields = {
      checkout_status: newStatus,
      updated_at: new Date(),
    };

    if (newStatus === "after") {
      updateFields.status = status; // ← これ追加！
    }

    await Room.update(updateFields, { where: { id, hotel_id } });

    return res.json({
      success: true,
      newStatus,
      message: `部屋ID:${id} のチェックアウト状態を '${newStatus}' に変更しました。`,
    });

  } catch (err) {
    console.error("❌ updateCheckoutStatus error:", err);
    return res.status(500).json({ success: false, error: "サーバーエラー（チェックアウト切替）" });
  }
};


exports.bulkUpdateRoomStatus = async (req, res) => {
  const t = await Room.sequelize.transaction();

  try {
    console.log(`req.body`,req.body)
    const { updates, updateGuestList,hotelId } = req.body;
    const tableName = Room.getTableName();
    console.log(`hotelId`,hotelId)

    // =========================================================
    // ① ステータス更新（excel_status + clean_flag 対応）
    // =========================================================

    await Room.update(
      {
        cleaning_done_time: null,
        cleaning_start_time: null,
        cleaning_status: "not_started",
      },
      { where: { hotel_id: hotelId } }
    );


    if (Array.isArray(updates) && updates.length > 0) {
      const ids = updates.map((u) => u.room_id);

      const caseStatus = updates
        .map((u) => `WHEN ${u.room_id} THEN '${u.status}'`)
        .join(" ");

      const caseGuest = updates
        .map((u) => `WHEN ${u.room_id} THEN ${u.guest_count ?? 0}`)
        .join(" ");

      const caseExcel = updates
        .map((u) => `WHEN ${u.room_id} THEN '${u.excel_status ?? ""}'`)
        .join(" ");

      // 🆕 clean_flag の CASE 文
      const caseCleanFlag = updates
        .map((u) => `WHEN ${u.room_id} THEN '${u.clean_flag ?? ""}'`)
        .join(" ");

      const sqlStatus = `
        UPDATE ${tableName}
        SET
          status = CASE id ${caseStatus} END,
          guest_count = CASE id ${caseGuest} END,
          excel_status = CASE id ${caseExcel} END,
          clean_flag = CASE id ${caseCleanFlag} END,
          updated_at = NOW()
        WHERE id IN (${ids.join(",")});
      `;

      await Room.sequelize.query(sqlStatus, { transaction: t });

      // 🔹 対象部屋のみ更新（全件更新バグ修正済）
      await Room.update(
        {
          checkout_status: "before",
          stay_type: "group",
          updated_at: new Date(),
          notes:""
        },
        { where: { id: ids }, transaction: t }
      );

      await AmenityRequest.update(
        { status: "done" },
        { where: {}, transaction: t } // ← 全件更新するなら必ず where: {} と明示
      );

    }

    // =========================================================
    // ② 人数更新（updateGuestList全件・ゼロ除去対応）
    // =========================================================
    if (updateGuestList && typeof updateGuestList === "object") {
      const entries = Object.entries(updateGuestList);

      if (entries.length > 0) {
        const caseGuestAll = entries
          .map(([roomNo, count]) => {
            const trimmed = String(roomNo).replace(/^0+/, "");
            return `WHEN '${trimmed}' THEN ${Number(count) || 0}`;
          })
          .join(" ");

        const roomNos = entries
          .map(([roomNo]) => `'${String(roomNo).replace(/^0+/, "")}'`)
          .join(",");

        const sqlGuest = `
          UPDATE ${tableName}
          SET
            guest_count = CASE room_number ${caseGuestAll} END,
            updated_at = NOW()
          WHERE room_number IN (${roomNos});
        `;

        await Room.sequelize.query(sqlGuest, { transaction: t });
      }
    }

    await t.commit();
    res.json({ success: true, updated: updates?.length || 0 });
  } catch (err) {
    await t.rollback();
    console.error("❌ bulkUpdateRoomStatus error:", err);
    res.status(500).json({ success: false, error: "一括更新失敗" });
  }
};



exports.registerOtherRoomRequest = async (req, res) => {
  try {
    const { room_id, instruction } = req.body;

    if (!room_id || !instruction) {
      return res.status(400).json({ error: 'room_id と instruction は必須です。' });
    }

    // 対象の部屋を取得
    const room = await Room.findByPk(room_id);
    if (!room) {
      return res.status(404).json({ error: '指定された部屋が見つかりません。' });
    }

    // 既存メモがあれば追記（改行区切り）
    const existingNotes = room.notes || '';
    const newNote = existingNotes
      ? `${existingNotes}\n📝その他依頼：${instruction}`
      : `📝その他依頼：${instruction}`;

    // 更新
    await room.update({ notes: newNote, updated_at: new Date() });

    res.json({
      message: 'その他の依頼をnotesに登録しました。',
      room_id,
      updated_notes: newNote
    });

  } catch (err) {
    console.error('❌ registerOtherRoomRequest エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
};

// ===============================
// ⚙️ その他依頼一覧を取得
// ===============================
exports.getOtherRoomRequests = async (req, res) => {
  try {
    const { hotel_id } = req.query;

    const where = {};
    if (hotel_id) where.hotel_id = hotel_id;

    // notes に「📝その他依頼」が含まれている部屋を取得
    const rooms = await Room.findAll({
      where,
      attributes: ['id', 'room_number', 'floor', 'guest_name', 'notes', 'updated_at'],
      order: [['floor', 'ASC'], ['room_number', 'ASC']]
    });

    // 📝が含まれる部屋だけフィルタ
    const filtered = rooms.filter(r => r.notes && r.notes.includes('📝その他依頼'));

    res.json(filtered);

  } catch (err) {
    console.error('❌ getOtherRoomRequests エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
};

// ===============================
// 🗑 その他依頼（notes）の削除
// ===============================
exports.deleteOtherRoomRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ error: '対象の部屋が見つかりません。' });
    }

    if (!room.notes || !room.notes.includes('📝その他依頼')) {
      return res.status(400).json({ error: '削除対象の依頼が存在しません。' });
    }

    // 🧹 「📝その他依頼：」部分だけ削除（他メモがあっても保持）
    const cleanedNotes = room.notes
      .split('\n')
      .filter(line => !line.includes('📝その他依頼'))
      .join('\n')
      .trim();

    await room.update({ notes: cleanedNotes || null, updated_at: new Date() });

    res.json({ message: 'その他依頼を削除しました。', id, updated_notes: cleanedNotes });
  } catch (err) {
    console.error('❌ deleteOtherRoomRequest エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
};

// ----------------------------------------------------
// 滞在タイプ 一括更新処理
// ----------------------------------------------------
exports.bulkUpdateStayType = async (req, res) => {
  const { hotel_id, updates } = req.body;

  if (!updates || typeof updates !== "object") {
    return res.status(400).json({
      success: false,
      error: "updates が不正です",
    });
  }

  try {
    const ids = Object.keys(updates);

    console.log("🟣 一括 stay_type 更新リクエスト:", updates);

    // まとめて UPDATE（高速）
    for (const id of ids) {
      await Room.update(
        { stay_type: updates[id] },
        { where: { id, hotel_id } }
      );
    }

    return res.json({
      success: true,
      updated_count: ids.length,
      updated_ids: ids,
    });

  } catch (err) {
    console.error("❌ bulkUpdateStayType エラー:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.bulkUpdateCheckoutStatus = async (req, res) => {
  const { hotel_id, updates } = req.body;

  if (!updates || typeof updates !== "object") {
    return res.status(400).json({ success: false, error: "updates が不正" });
  }

  try {
    const ids = Object.keys(updates);

    for (const id of ids) {
      await Room.update(
        { checkout_status: updates[id] },
        { where: { id, hotel_id } }
      );
    }

    res.json({ success: true, updated: ids.length });

  } catch (err) {
    console.error("bulkUpdateCheckoutStatus エラー:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.startCleaning = async (req, res) => {
  try {
    const { room_id } = req.body;

    if (!room_id) {
      return res.status(400).json({ error: "room_id is required" });
    }

    const room = await Room.findByPk(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    await room.update({
      cleaning_status: "in_progress",
      cleaning_start_time: new Date(),
      cleaning_done_time: null
    });

    return res.json({ success: true, room });
  } catch (err) {
    console.error("startCleaning error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.finishCleaning = async (req, res) => {
  try {
    const { room_id } = req.body;

    if (!room_id) {
      return res.status(400).json({ error: "room_id is required" });
    }

    const room = await Room.findByPk(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    await room.update({
      cleaning_status: "done",
      cleaning_done_time: new Date()
    });

    return res.json({ success: true, room });
  } catch (err) {
    console.error("finishCleaning error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.undoCleaning = async (req, res) => {
  try {
    const { room_id } = req.body;

    if (!room_id) {
      return res.status(400).json({ error: "room_id is required" });
    }

    const room = await Room.findByPk(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    await room.update({
      cleaning_status: "not_started",
      cleaning_start_time: null,
      cleaning_done_time: null
    });

    return res.json({ success: true, room });
  } catch (err) {
    console.error("undoCleaning error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
//   確認済み（checked）
// =========================
exports.inspectorChecked = async (req, res) => {
  try {
    const { room_id } = req.body;

    if (!room_id) {
      return res.status(400).json({ message: "room_id is required" });
    }

    // 部屋取得
    const room = await Room.findByPk(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 更新
    await room.update({
      cleaning_status: "checked",
      status:"checked",
      inspector_checked_at: new Date() // ← 必要なら
    });

    return res.json({
      message: "Room marked as checked",
      room
    });

  } catch (err) {
    console.error("❌ inspectorChecked error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.closeDailyList = async (req, res) => {
  try {
    const { hotel_id, work_date } = req.body;

    if (!hotel_id || !work_date) {
      return res.status(400).json({
        success: false,
        error: "hotel_id と work_date は必須です。",
      });
    }

    // 🔥 既に登録済みチェック
    const exists = await DailyRoomList.findOne({
      where: { hotel_id, work_date },
    });

    if (exists) {
      return res.json({ exists: true, message: "既に登録済みです。" });
    }

    // 🔥 ホテルの部屋一覧取得
    const rooms = await Room.findAll({
      where: { hotel_id },
      order: [
        ["floor", "ASC"],
        ["room_number", "ASC"],
      ],
    });

    if (!rooms.length) {
      return res.status(404).json({ success: false, error: "部屋がありません。" });
    }

    // ⭐ DailyRoomList に保存するJSON生成
    const insertList = rooms.map((r) => ({
      hotel_id,
      work_date,

      room_number: r.room_number,
      floor: r.floor,

      // 🟢 ステータスは clean_flag を保存（従来通り）
      status: r.clean_flag,

      // 🆕 サブステータス
      sub_status: r.status ?? null,

      // 🆕 ゲスト数
      guest_count: r.guest_count ?? 0,

      // 🆕 アメニティのみ（旧スペル対応）
      amenity_only: r.status === "stay_amenytyOnliy" ? 1 : 0,

      // 🆕 FIT / 団体
      stay_type: r.stay_type ?? "individual",

      // 🆕 コメント
      notes: r.notes ?? null,

      // 初期フラグ（全部 false = 0）
      open_flag: 0,
      checked_flag: 0,
      amenity_complete_flag: 0,

      // 割り当て系
      assigned_staff_id: null,
      cleaned_by: null,
      cleaning_done_at: null,
      checked_done_at: null,

      created_at: new Date(),
      updated_at: new Date(),

      is_edited: 0,
      edit_history: null,
    }));

    // 🔥 一括登録
    await DailyRoomList.bulkCreate(insertList);

    return res.json({
      success: true,
      count: insertList.length,
      message: `${work_date} の締め処理完了（stay_type / notes 含む）`,
    });

  } catch (err) {
    console.error("❌ closeDailyList error:", err);
    return res.status(500).json({
      success: false,
      error: "サーバーエラー（締め処理）",
    });
  }
};


exports.getDailyRoomList = async (req, res) => {
  try {
    const { date, hotel_id } = req.query;

    if (!date || !hotel_id) {
      console.log()
      return res.json({
        success: false,
        error: "date と hotel_id は必須です"
      });
    }

    // 🔥 daily_room_list を取得
    const rows = await DailyRoomList.findAll({
      where: {
        work_date: date,
        hotel_id: hotel_id
      },
      order: [["room_number", "ASC"]]
    });

    console.log(`rows`,rows)

    return res.json({
      success: true,
      rows
    });

  } catch (err) {
    console.error("getDailyRoomList ERROR:", err);
    return res.json({
      success: false,
      error: "サーバーエラー"
    });
  }
};

exports.assignBulk = async (req, res) => {
  try {
  const { hotel_id, date, updates } = req.body;

  if (!hotel_id || !date || !updates || updates.length === 0) {
    return res.json({ success: false, error: "Missing parameters" });
  }

  // 🔥 トランザクション開始
  const t = await DailyRoomList.sequelize.transaction();

  try {
    // まとめて UPDATE
    for (const u of updates) {
      await DailyRoomList.update(
        { assigned_staff_id: u.worker },
        {
          where: {
            hotel_id,
            work_date: date,
            id: u.room_id
          },
          transaction: t
        }
      );
    }

    await t.commit();
    return res.json({ success: true });

  } catch (err) {
    await t.rollback();
    console.error("assignBulkMulti ERROR:", err);
    return res.json({
      success: false,
      error: "assignBulkMulti failed",
      details: err.message
    });
  }

} catch (err) {
  console.error("assignBulkMulti FATAL:", err);
  return res.json({ success: false, error: "fatal error" });
}
};

exports.updateDailyRoomList = async (req, res) => {
  try {
    const { rows, hotel_id } = req.body;

    if (!rows || !Array.isArray(rows) || !hotel_id) {
      return res.status(400).json({
        success: false,
        error: "rows と hotel_id は必須です"
      });
    }

    const ids = rows.map(r => r.id);

    // 🔥 1回だけ DB から必要な全レコード取得
    const records = await DailyRoomList.findAll({
      where: { id: ids, hotel_id }
    });

    // 🔥 id → record の高速参照マップ化
    const recordMap = {};
    records.forEach(r => recordMap[r.id] = r);

    const updates = [];

    for (const row of rows) {
      const record = recordMap[row.id];
      if (!record) continue;

      const history = record.edit_history ? JSON.parse(record.edit_history) : [];
      const logTime = new Date();

      // 差分チェック
      let hasDiff = false;

      if (row.status !== record.sub_status) {
        hasDiff = true;
        history.push({
          time: logTime,
          field: "status",
          before: record.sub_status,
          after: row.status
        });
      }

      if (row.stay_type !== record.stay_type) {
        hasDiff = true;
        history.push({
          time: logTime,
          field: "stay_type",
          before: record.stay_type,
          after: row.stay_type
        });
      }

      if (row.notes !== record.notes) {
        hasDiff = true;
        history.push({
          time: logTime,
          field: "notes",
          before: record.notes,
          after: row.notes
        });
      }

      if (!hasDiff) continue;

      // 🔥 更新内容をバッファに詰める
      updates.push(
        record.update({
          sub_status: row.status,
          stay_type: row.stay_type,
          notes: row.notes,
          is_edited: 1,
          edit_history: JSON.stringify(history),
          updated_at: new Date()
        })
      );
    }

    // 🔥 並列で一気に更新（超高速）
    await Promise.all(updates);

    return res.json({ success: true });

  } catch (err) {
    console.error("updateDailyRoomList ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "サーバーエラー（updateDailyRoomList）"
    });
  }
};

exports.updateDailyCheckoutBulk = async (req, res) => {
  try {
    const { updates, shimeData } = req.body;
    // updates = { "811": "before", "1001": "after" }
    // shimeData = globalShimeData（DailyRoomList の全件）

    if (!updates || !shimeData) {
      return res.status(400).json({ success: false, error: "updates と shimeData が必要です" });
    }

    const roomNumbers = Object.keys(updates);
    let updatedIds = [];

    for (const room of roomNumbers) {
      const checkout_status = updates[room];

      // 🔥 globalShimeData の中から id を探す
      const target = shimeData.find(d => String(d.room_number) === String(room));

      if (!target) {
        console.warn("⚠ データが見つからない:", room);
        continue;
      }

      const id = target.id;  // ← これが本命！！！

      // 🔥 id で更新（hotel_id / work_date は不要）
      await DailyRoomList.update(
        {
          checkout_status,
          updated_at: new Date()
        },
        {
          where: { id }  // ← ★ これ！！！
        }
      );

      updatedIds.push(id);
    }

    res.json({ success: true, updated_ids: updatedIds });

  } catch (err) {
    console.error("❌ updateDailyCheckoutBulk error:", err);
    res.status(500).json({ success: false, error: "server error" });
  }
};
exports.updateDailyCheckoutBulk = async (req, res) => {
  try {
    const { updates } = req.body;
    // updates = [ { id:805, checkout_status:'before' }, {...} ]

    for (const row of updates) {
      console.log(row)
      await DailyRoomList.update(
        {
          checkout_status: row.checkout_status,
          checkout_time: new Date(),
        },
        { where: { id: row.id } }
      );
    }

    res.json({ success: true, updated: updates.length });

  } catch (err) {
    console.error("❌ dailyCheckout bulk error:", err);
    res.status(500).json({ success: false });
  }
};
exports.updateDailyRoomStatus = async (req, res) => {
  try {
    const { id, status, user_id,roomNumber,hotelId } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "id and status are required" });
    }

    let updateData = {};
    const now = new Date();

    console.log(req.body)

    switch (status) {

      // ============================
      // 🔵 通常ステータス
      // ============================
      case "aberto":
        updateData = {
          open_flag: 1,
          cleaned_by: null,
          cleaning_done_at: null,
          checked_flag: 0,
          checked_done_at: null,
          amenity_complete_flag: 0, // ← リセット必要
          updated_at: now
        };
        break;

      case "limpo":
        updateData = {
          cleaned_by: user_id || null,
          cleaning_done_at: now,
          checked_flag: 0,
          checked_done_at: null,
          amenity_complete_flag: 0, // ← リセット必要
          updated_at: now
        };
        break;

      case "verificado":
        updateData = {
          checked_flag: 1,
          checked_done_at: now,
          updated_at: now
        };

          await updateCheckRoom(roomNumber, hotelId, 'checked');
        break;

      case "nao_aberto":
        updateData = {
          open_flag: 0,
          cleaned_by: null,
          cleaning_done_at: null,
          checked_flag: 0,
          checked_done_at: null,
          amenity_complete_flag: 0, // ← リセット必要
          updated_at: now
        };

        await updateCheckRoom(roomNumber, hotelId, 'noChecked');
        break;

      // ============================
      // 🔵 アメニティステータス
      // ============================
      case "done": // Feito
        updateData = {
          amenity_complete_flag: 1,
          updated_at: now
        };
        break;

      case "before": // Não Feito
        updateData = {
          amenity_complete_flag: 0,
          updated_at: now
        };
        break;
    }

    await DailyRoomList.update(updateData, { where: { id } });

    return res.json({ success: true });

  } catch (err) {
    console.error("updateDailyRoomStatus error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function updateCheckRoom(roomNumber, hotelId, status) {
  try {
    console.log(`roomNumber`,roomNumber)
    console.log(`hotelId`,hotelId)
    console.log(`status`,status)
    const [affected] = await Room.update(
      { status },
      {
        where: {
          room_number: roomNumber,
          hotel_id: hotelId
        }
      }
    );

    if (affected === 0) {
      console.warn(`⚠ Room not found for updateCheckRoom: ${roomNumber} (hotel: ${hotelId})`);
    } else {
      console.log(`✅ Room updated (${roomNumber}) to status=${status}`);
    }

  } catch (err) {
    console.error("❌ updateCheckRoom error:", err);
  }
}


exports.undoRestore = async (req, res) => {
  try {
    const { rooms } = req.body;



    if (!rooms || rooms.length === 0) {
      return res.status(400).json({ error: "rooms is required" });
    }

    for (const r of rooms) {

      const updateData = {
        open_flag: 0,
        cleaned_by: null,
        cleaning_done_at: null,
        amenity_complete_flag: 0,
      };

      await DailyRoomList.update(updateData, { where: { id: r.id } });
    }

    return res.json({ success: true });

  } catch (err) {
    console.error("undoRestore error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
