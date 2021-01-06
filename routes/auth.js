const router = require('express').Router()
const User = require('../model/user')

// VALIDATION
const Joi = require('joi')


const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(4).required()
})

router.post('/register', async (req, res) => {

    
    try {

        // VALIDATE THE DATA BEFORE CREATING
        const result = await schema.validateAsync(req.body)

        // Create a user
        const user = new User({
            email: req.body.email,
            password: req.body.password
        })
        
        try {
            const savedUser = await user.save();
            res.send(`user ${savedUser.email} has been created`)
        }catch(err) {
            res.status(400).send(err)
        }
    } catch(err) {
        res.status(400).send(err.details[0].message)
    }

})

// router.post('/login')

// local

module.exports = router;
