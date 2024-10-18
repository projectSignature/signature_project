const registerService = require('../services/orders.registerService');

const registerController = {
    // レジ情報取得
    getRegisters: async (req, res) => {
        try {
            const { date, clientsId } = req.query;
            if (!date || !clientsId) {
                return res.status(400).json({ message: '日付とクライアントIDが必要です' });
            }

            const registers = await registerService.getRegistersByDateAndClient(date, clientsId);
            console.log('date: is ' + date);
            return res.status(200).json(registers);
        } catch (error) {
            console.error('レジ情報の取得エラー:', error);
            return res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    },

    // レジオープンの登録
    openRegister: async (req, res) => {
        try {
            const registerData = req.body;

            // サービス層にデータを渡して処理
            const result = await registerService.insertRegisterData(registerData);

            return res.status(201).json(result);
        } catch (error) {
            console.error('レジオープン登録エラー:', error);
            return res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    },

    // レジオープンの登録
    closeRegister: async (req, res) => {
        try {
            const registerData = req.body;

            // サービス層にデータを渡して処理
            const result = await registerService.insertCloseRegisterData(registerData);

            return res.status(201).json(result);
        } catch (error) {
            console.error('レジオープン登録エラー:', error);
            return res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    }
};

module.exports = registerController;
