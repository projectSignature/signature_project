const Reservation = require('../schema/orders/Reservation');  // 予約モデルをインポート

const reservationService = {
    // 全ての予約を取得
    getAll: async (userId,reservation_date) => {

        return await Reservation.findAll({
            where: {
              user_id: userId,
              reservation_date:reservation_date  }
        });
    },

    // 特定の予約をIDで取得
    getById: async (id) => {
        return await Reservation.findOne({
            where: { id }
        });
    },

    // IDで予約を削除
   deleteById: async (id) => {
       return await Reservation.destroy({
           where: { id }
       });
   },

   // 新しい予約を作成
    create: async (reservationData) => {
        return await Reservation.create(reservationData);
    },

    // IDで予約を更新
    updateById: async (id, updateData) => {
        return await Reservation.update(updateData, {
            where: { id }
        });
    }
};

module.exports = reservationService;