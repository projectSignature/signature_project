const userService = require('../services/orders.user.service');
const { encryptPassword } = require('../libs/encypt/password-crypto');
const jwt = require('jsonwebtoken');

const OrdersSignupController = {
    signup: async (request, response) => {
        try {
            console.log('order newAccount');

            // リクエストボディからデータを取得
            const { email, username, password,table_count } = request.body;

            // 簡易バリデーション（email, username, password が存在するか確認）
            if (!email || !username || !password) {
                return response.status(400).send({ success: false, message: 'Email, username, or password is missing.' });
            }

            // Email と Username の重複チェック
            const [userByEmail, userByUsername] = await Promise.all([
                userService.getByEmail(email),
                userService.getByUsername(username)
            ]);

            if (userByEmail) {
                return response.status(409).send({ status: 409, success: false, message: 'Email already exists.' });
            }

            if (userByUsername) {
                return response.status(409).send({ status: 409, success: false, message: 'Username already exists.' });
            }

            // パスワードのハッシュ化
            const passwordEncrypted = await encryptPassword(password);

            // 新しいユーザーを作成
            const newUser = await userService.create({
                email,
                username,
                table_count,
                password: passwordEncrypted
            });

            // JWT トークンの生成
            const secretKey = 'abracadabra';
            const token = jwt.sign({ userId: newUser.id }, secretKey);

            // 成功メッセージの送信
            return response.status(201).send({ status: 201, success: true, info: { token }, message: 'User created.' });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: 500, success: false, message: 'Internal server error.' });
        }
    }
};

module.exports = OrdersSignupController;
