const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const winston = require('winston')
const cookieParser = require('cookie-parser')
const { engine } = require('express-handlebars')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// ========================
// * Middlewares
// ========================
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.engine('.hbs', engine({ defaultLayout: false, extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser(
    process.env.SECRET
))
app.use(helmet())

// ========================
// * Routes
// ========================
app.get('/', (req, res) => {
    res
        .status(200)
        .render('index')
})
app.post('/login', require('./controller/login.controller'))
app.get('/isloggedin', require('./controller/isLoggedIn.controller'))
app.get('/candidate', require('./controller/candidate.controller'))
app.get('/vote', require('./middleware/auth.middleware'), require('./controller/vote.controller').read)
app.post('/vote', require('./middleware/auth.middleware'), require('./controller/vote.controller').create)
app.post('/logout', require('./middleware/auth.middleware'), require('./controller/logout.controller'))

// ========================
// Listener
// ========================
app.listen(PORT, console.log(`Server is running on port ${PORT}`))