const jwt = require('jsonwebtoken');
const { verifyPassword } = require('../libs/encypt/password-crypto');
const userService = require('../services/pos.user.service');

const signinController = {

    signin: async (request, response) => {
        try {
            console.log('POSメイン取得')
            const { email, password } = request.body;
            console.log(request.body)

            if (!email || !password) {
                return response.status(400).send({ success: false, message: 'Email or password not provided.' });
            }

            const user = await userService.getByUsername(email);

            if (!user) {
                return response.status(404).send({ success: false, message: 'User not found.' });
            }
           if(user.password_hash===password){
             const secretKey = 'abracadabra';
             console.log(user)
             const token = jwt.sign({ userId: user.user_id,language: user.language,name:user.representative_name,expense_id:user.expenses_get_id, email:user.username}, secretKey);
            return response.status(200).send({ success: true, info: { token }, message: 'User logged in successfully' });
           }else{
             return response.status(401).send({ success: false, message: 'Invalid password.' });
           }
            console.log('User found:', user);
            console.log('Stored password:', user.password);
            console.log('Provided password:', password);

            // const authorizedPassword = await verifyPassword(password, user.password);
            console.log('Password match result:', authorizedPassword);

            if (!authorizedPassword) {

            }




        } catch (error) {
            console.error(error);
            return response.status(500).send({ success: false, message: 'Internal server error.' });
        }
    }
};

module.exports = signinController;
