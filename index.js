const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')


dotenv.config()
// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to DB!')
)

// Middlewares
app.use(express.json())
app.use(cors())

// Import Routes
const authRoute = require('./routes/auth')
const objectRoute = require('./routes/object')

// Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/objects', objectRoute)

app.listen(5000, () => console.log('Server up and running'))