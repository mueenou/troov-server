const Joi = require('joi')

const registerValidation = async (data) => {
    
    const schema = Joi.object({
        email: Joi.string().min(6).email(),
        password: Joi.string().min(4),
        password_confirmation: Joi.any().equal(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Password does not match' })
    })

    return await schema.validateAsync(data)
}

const loginValidation = async (data) => {
    
    const schema = Joi.object({
        email: Joi.string().min(6).email(),
        password: Joi.string().min(4)
    })

    return await schema.validateAsync(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation