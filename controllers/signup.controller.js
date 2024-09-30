const signupDto = require('../dto/signup.dto')
const userService = require('../services/user.service')
const { encryptPassword } = require('../libs/encypt/password-crypto')
const jwt = require('jsonwebtoken')

const signupController = {
    signup: async (request, response) => {
        try {
            const { error, value: payload } = signupDto.validate(request.body)

            if (error) {
                return response.status(400).send({ success: false, error : error.details })
            }

            const [userByEmail, userByUsername] = await Promise.all([
                userService.getByEmail(payload.email),
                userService.getByUsername(payload.username)
            ])

            if (userByEmail) {
                return response.status(409).send({ success: false, message: 'Email already exist.'})
            }

            if (userByUsername) {
                return response.status(409).send({ success: false, message: 'Username already exist.'})
            }

            const passwordEncrypted = await encryptPassword(payload.password)

            const newUser = await userService.create({ ...payload, password: passwordEncrypted })

            const secretKey = 'abracadabra'
            const token = jwt.sign({ userId: newUser.id }, secretKey)

            return response.status(201).send({ success: true, info: { token }, message: 'User created.'})
        }

        catch (error) {
            console.error(error)
            return response.status(500).send({ success: false, message: 'Internal server error.'})
        }
    }
}

module.exports = signupController
