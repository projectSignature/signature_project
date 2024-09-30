const Joi = require('joi')

const signupDto = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    language: Joi.string().required(),
    isActive: Joi.boolean().required(),
    phoneNumber: Joi.string(),
    paymentStatus: Joi.string(),
    invoiceNumber: Joi.string(),
    companyName: Joi.string(),
    categoryNumber: Joi.string()
})

module.exports = signupDto