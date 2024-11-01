const jwt = require('jsonwebtoken');
const { verifyPassword } = require('../libs/encypt/password-crypto');
const userService = require('../services/orders.user.service');

const OrderssigninController = {

    signin: async (request, response) => {
        try {
            console.log('オーダーズメイン取得')
            const { email, password } = request.body;
            console.log(request.body)
               console.log(email)
               console.log(password)
            if (!email || !password) {
                return response.status(400).send({ success: false, message: 'Email or password not provided.' });
            }

            const user = await userService.getByUsername(email);

            if (!user) {
                return response.status(404).send({ success: false, message: 'User not found.' });
            }

            const authorizedPassword = await verifyPassword(password, user.password);
              console.log('Password match result:', authorizedPassword);

              if (!authorizedPassword) {
                  return response.status(401).send({ success: false, message: 'Invalid password.' });
              }else{
                const secretKey = 'abracadabra';
                console.log(user)
                const token = jwt.sign({ userId: user.id,
                  email:user.email,
                  username:user.username,
                  table_count:user.table_count,
                  language:user.language,
                  role:user.role,
                  uber_enabled:user.uber_enabled,
                  takeout_enabled:user.takeout_enabled,
                  tax_enabled:user.tax_enabled,
                  receipt_address:user.receipt_address,
                  receipt_display_name:user.receipt_display_name,
                  receipt_tel:user.receipt_tel,
                  receipt_postal_code:user.receipt_postal_code,
                  receipt_logo_url:user.receipt_logo_url


                }, secretKey);
               return response.status(200).send({ success: true, info: { token }, message: 'User logged in successfully' });
              }



        } catch (error) {
            console.error(error);
            return response.status(500).send({ success: false, message: 'Internal server error.' });
        }
    }
};

module.exports = OrderssigninController;
