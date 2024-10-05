const { Router } = require('express')
const signupController = require('../../controllers/signup.controller')
const OrderssignupController = require('../../controllers/orders.signup.controller')

const signupRouter = Router()

signupRouter.post('/signup', signupController.signup)
signupRouter.post('/orders/signup', OrderssignupController.signup)

module.exports = signupRouter
