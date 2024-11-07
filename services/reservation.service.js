const Reservation = require('../schema/orders/reservation');  // 予約モデルをインポート
const { Op } = require('sequelize');

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
      try{
        console.log('reservation')
        return await Reservation.create(reservationData);
      }catch(e){
        console.log(e)
      }

    },

    // IDで予約を更新
    updateById: async (id, updateData) => {
        return await Reservation.update(updateData, {
            where: { id }
        });
    },
    // ユーザーIDと日付範囲で予約を取得
getReservationsByDateRange: async (user_id, startDate, endDate) => {
    return await Reservation.findAll({
        where: {
            user_id: user_id,  // ユーザーIDを条件に追加
            reservation_date: {
                [Op.between]: [startDate, endDate]  // 日付範囲のクエリ
            }
        }
    });
}



};

module.exports = reservationService;
