const { Op } = require('sequelize');
const Register = require('../schema/orders/registers');

const registerService = {
    // 指定された日付とクライアントIDでレジ情報を取得するサービス
    getRegistersByDateAndClient: async (serchDay, clientsId) => {
      try {
      console.log('serchDay is:', serchDay);
      console.log('clientsId is:', clientsId);

      const registers = await Register.findAll({
          where: {
              register_day: serchDay,
              user_id: clientsId
          }
      });

      console.log('Registers found:', registers);
      return registers;

  } catch (error) {
      console.error('Error fetching registers:', error);
      return null;
  }
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
            status:'open',
            register_day:registerData.registerDT
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
