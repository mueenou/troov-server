const router = require('express').Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { registerValidation, loginValidation } = require('../validation')

// VALIDATION
const Joi = require('joi')
const verify = require('./verifyToken')

router.post('/register', async (req, res) => {

    try {
        
        // VALIDATE THE DATA BEFORE CREATING
        const result = await registerValidation(req.body)

        const foundUser = await User.findOne({email: req.body.email});
        
        if(foundUser) res.status(409).send('This email is already taken')

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
        console.log(result)

        const user = await User.findOne({email: req.body.email});

        if(!user) return res.status(422).send({error: `Email doesn't exist`})

        const validPass = await bcrypt.compare(req.body.password, user.password)

        if(!validPass) return res.status(403).send({error: `Invalid password`})

        // Create and send back token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        return res.header('auth-token', token).send({token})

    }catch(err) {
        res.status(403).send({error: err.details[0].message})
    }
})

router.get('/', async (req, res) => {

    console.log(req.header('Authorization').split(" ")[1])

    const deserialized = jwt.verify(req.header('Authorization').split(" ")[1], process.env.TOKEN_SECRET)
    console.log(deserialized)

    const { _id, iat } = deserialized
    const foundUser = await User.findOne({ _id })

    if(!foundUser) res.send('user not found')

    res.send( {user: { _id: foundUser._id, email: foundUser.email }} )

})

// router.post('/login')

// local

module.exports = router;
