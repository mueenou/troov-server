const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/userModel')

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'codeworkrauthentication'
}, async (payload, done) => {
    try {
        // Find the user specified in token
        const user = await User.findById(payload.sub)

        // If user doesn't exist, handle it
        if (!user) {
            return done(null, false)
        }

        // Otherwise, return the user
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    console.log(email);
    try {
        // Find the user given the email
        const user = await User.findOne({ email })
        // if not, handle it
        if (!user) {
            return done(null, false)
        }

        // Check if the passwort is correct
        const isMatch = await user.isValidPassword(password)

        // if not, handle it
        if (!isMatch) {
            return done(null, false)
        }

        // Otherwise, return the user
        done(null, user)
    } catch (error) {
        done(error, false)
    }

}))