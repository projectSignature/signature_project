const reservationService = require('../services/reservation.service');  // 予約サービスをインポート

const ReservationController = {
    // 全ての予約を取得
    getAllReservations: async (req, res) => {
        try {
          console.log( req.query)
            const { user_id, reservation_date } = req.query;  // クエリパラメータから user_id を取得
            const reservations = await reservationService.getAll(user_id, reservation_date );
            return res.status(200).send({ success: true, data: reservations });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    // 特定の予約を取得
    getReservationById: async (request, response) => {
        try {
            const { id } = request.params;
            const reservation = await reservationService.getById(id);

            if (!reservation) {
                return response.status(404).send({ success: false, message: 'Reservation not found.' });
            }

            return response.status(200).send({ success: true, data: reservation });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ success: false, message: 'Internal server error.' });
        }
    },

    // 予約をIDで削除
    deleteReservation: async (req, res) => {
        try {
            const { id } = req.params;  // パラメータから予約IDを取得

            // 予約が存在するか確認
            const reservation = await reservationService.getById(id);

            if (!reservation) {
                return res.status(404).send({ success: false, message: 'Reservation not found.' });
            }

            // 予約を削除
            await reservationService.deleteById(id);
            return res.status(200).send({ success: true, message: 'Reservation deleted successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ success: false, message: 'Internal server error.' });
        }
    }
};

module.exports = ReservationController;
