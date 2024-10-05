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
    },

    // 新しい予約を追加
   addReservation: async (req, res) => {
       try {
         console.log('nee resarvision creats')
           const { user_id, reservation_date, reservation_start_time, reservation_end_time, table_number, reservation_name, phone_number, num_people, remarks } = req.body;

           // 必要なフィールドの簡単なバリデーション
           if (!user_id || !reservation_date || !reservation_start_time || !reservation_end_time || !table_number || !reservation_name || !phone_number || !num_people) {
               return res.status(400).send({ success: false, message: 'Missing required fields.' });
           }

           // 予約の作成
           const newReservation = await reservationService.create({
               user_id,
               reservation_date,
               reservation_start_time,
               reservation_end_time,
               table_number,
               reservation_name,
               phone_number,
               num_people,
               remarks
           });

           return res.status(201).send({ success: true, data: newReservation, message: 'Reservation added successfully.' });
       } catch (error) {
           console.error(error);
           return res.status(500).send({ success: false, message: 'Internal server error.' });
       }
   },

   // 予約情報をIDで更新
updateReservation: async (req, res) => {
    try {
        const { id } = req.params;  // URLパラメータから予約IDを取得
        const { user_id, reservation_date, reservation_start_time, reservation_end_time, table_number, reservation_name, phone_number, num_people, remarks } = req.body;

        // 必要なフィールドの簡単なバリデーション
        if (!user_id || !reservation_date || !reservation_start_time || !reservation_end_time || !table_number || !reservation_name || !phone_number || !num_people) {
            return res.status(400).send({ success: false, message: 'Missing required fields.' });
        }

        // 予約が存在するか確認
        const reservation = await reservationService.getById(id);
        if (!reservation) {
            return res.status(404).send({ success: false, message: 'Reservation not found.' });
        }

        // 予約情報を更新
        await reservationService.updateById(id, {
            user_id,
            reservation_date,
            reservation_start_time,
            reservation_end_time,
            table_number,
            reservation_name,
            phone_number,
            num_people,
            remarks
        });

        return res.status(200).send({ success: true, message: 'Reservation updated successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Internal server error.' });
    }
},

// 日付範囲で予約を取得
getReservationsByDateRange: async (req, res) => {
    try {
        const { startDate, endDate, user_id } = req.query;

        // クエリパラメータが正しく渡されているか確認
        if (!startDate || !endDate || !user_id) {
            return res.status(400).send({ success: false, message: '開始日、終了日、およびユーザーIDが必要です。' });
        }

        // サービスを使って予約データを取得
        const reservations = await reservationService.getReservationsByDateRange(user_id, startDate, endDate);
        return res.status(200).send({ success: true, data: reservations });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Internal server error.' });
    }
}

};


module.exports = ReservationController;
