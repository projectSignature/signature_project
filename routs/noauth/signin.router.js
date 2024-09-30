const { Router } = require('express')
const signinController = require('../../controllers/signin.controller')
const signinPosController = require('../../controllers/pos.signin.controller')

const signinRouter = Router()

signinRouter.post('/signin', signinController.signin)
signinRouter.post('/pos/signin', signinPosController.signin)

module.exports = signinRouter
