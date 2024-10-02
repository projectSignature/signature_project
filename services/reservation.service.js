const Reservation = require('../schema/orders/reservation');  // 予約モデルをインポート

const reservationService = {
    // 全ての予約を取得
    getAll: async (userId) => {
      console.log('予約確認に入った')
        return await Reservation.findAll({
            where: { user_id: userId }
        });
    },

    // 特定の予約をIDで取得
    getById: async (id) => {
        return await Reservation.findOne({
            where: { id }
        });
    }
};

module.exports = reservationService;
