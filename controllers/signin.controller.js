const jwt = require('jsonwebtoken');
const { verifyPassword } = require('../libs/encypt/password-crypto');
const userService = require('../services/user.service');

const signinController = {
    signin: async (request, response) => {
        try {
            const { email, password } = request.body;

            if (!email || !password) {
                return response.status(400).send({ success: false, message: 'Email or password not provided.' });
            }

            const user = await userService.getByEmail(email);

            if (!user) {
                return response.status(404).send({ success: false, message: 'User not found.' });
            }

            const authorizedPassword = await verifyPassword(password, user.password);
            if (!authorizedPassword) {
                return response.status(401).send({ success: false, message: 'Invalid password.' });
            }
            const secretKey = 'abracadabra';
            console.log(user)
            const token = jwt.sign({ userId: user.id,language: user.language,clientNmae:user.username,email:user.email }, secretKey);

            return response.status(200).send({ success: true, info: { token }, message: 'User logged in successfully' });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ success: false, message: 'Internal server error.' });
        }
    }
};

module.exports = signinController;
