const { Router } = require('express')
//const signinController = require('../../controllers/signin.controller')
//const signinPosController = require('../../controllers/pos.signin.controller')
const signinOrderController = require('../../controllers/orderskun.signin.controller')

const signinRouter = Router()

//signinRouter.post('/signin', signinController.signin)
//signinRouter.post('/pos/signin', signinPosController.signin)
signinRouter.post('/orders/signin', signinOrderController.signin)
module.exports = signinRouter
