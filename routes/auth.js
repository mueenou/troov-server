const router = require('express').Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {registerValidation, loginValidation} = require('../validation')

// VALIDATION
const Joi = require('joi')

router.post('/register', async (req, res) => {

    try {
        
        // VALIDATE THE DATA BEFORE CREATING
        const result = await registerValidation(req.body)

        const foundUser = await User.findOne({email: req.body.email});
        
        if(foundUser) res.send('this email is already taken')

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)


        // Create a user
        const user = new User({
            email: req.body.email,
            password: hashedPassword
        })
        
        try {
            const savedUser = await user.save();
            res.status(200).send({user: user._id})
        }catch(err) {
            res.status(400).send(err)
        }
        
    } catch(err) {
        res.status(400).send(err.details[0].message)
    }

})

router.post('/login', async (req, res) => {

    try {
        
        // VALIDATE THE DATA BEFORE CREATING
        const result = await loginValidation(req.body)

        const user = await User.findOne({email: req.body.email});

        if(!user) return res.status(400).send(`Email doesn't exist`)

        const validPass = await bcrypt.compare(req.body.password, user.password)

        if(!validPass) return res.status(400).send(`Invalid password`)

        // Create and send back token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send(token)

    }catch(err) {
        res.status(400).send(err.details[0].message)
    }
})

// router.post('/login')

// local

module.exports = router;
