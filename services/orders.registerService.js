const { Op } = require('sequelize');
const Register = require('../schema/orders/registers');

const registerService = {
    // 指定された日付とクライアントIDでレジ情報を取得するサービス
    getRegistersByDateAndClient: async (endDate, clientsId) => {
      // 日本時間の「今日の00:00:00」を取得する
      const now = new Date();
      // UTC時間に日本時間の9時間分のオフセットを追加
      const jstOffset = 9 * 60 * 60 * 1000;  // 日本のタイムゾーン UTC+9
      // UTCの現在時刻に対して、JSTオフセットを追加して、今日の00:00:00を設定
      const startDate = new Date(now.getTime() + jstOffset);
      startDate.setUTCHours(0, 0, 0, 0);  // 日本時間で00:00:00に設定
    const registers = await Register.findAll({
        where: {
            open_time: {
                [Op.between]: [startDate, endDate]  // 今日の00:00:00からフロントから来た日付まで
            },
            user_id: clientsId
        }
    });

    return registers;
},
    // レジオープンのデータをインサート
    insertRegisterData: async (registerData) => {
        // レジオープンデータをDBに登録
        console.log(registerData)
        const newRegister = await Register.create({
            user_id: registerData.user_id,
            bill_5000: registerData.bill_5000,
            bill_1000: registerData.bill_1000,
            coin_500: registerData.coin_500,
            coin_100: registerData.coin_100,
            coin_50: registerData.coin_50,
            coin_10: registerData.coin_10,
            coin_1: registerData.coin_1,
            open_time: registerData.open_time,
            open_amount: registerData.totalAmount,
            status:'open'
        });

        return newRegister;
    },
      // レジクローズのデータをインサート
        insertCloseRegisterData: async (registerData) => {
            // レジオープンデータをDBに登録
            console.log(registerData)
            const newRegister = await Register.create({
                user_id: registerData.user_id,
                bill_5000: registerData.bill_5000,
                bill_1000: registerData.bill_1000,
                coin_500: registerData.coin_500,
                coin_100: registerData.coin_100,
                coin_50: registerData.coin_50,
                coin_10: registerData.coin_10,
                coin_1: registerData.coin_1,
                close_time: registerData.open_time,
                close_amount: registerData.totalAmount,
                status:'close'
            });

            return newRegister;
        }
};

module.exports = registerService;
