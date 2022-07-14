const path = require('path')
const express = require('express')
const { Router } = require('express')
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
// * Global Middlewares
// ========================
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.engine('.hbs', engine({ defaultLayout: false, extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(cors({
    origin: ['*']
}))
app.use(morgan('dev'))
app.use(cookieParser(
    process.env.SECRET
))

// ========================
// * Routes
// ========================
/**
 * @type {express.Router}
 */
const webRoutes = new Router()
/**
 * @type {express.Router}
 */
const apiRoutes = new Router()
/**
 * @type {express.Router}
 */
const nonScrictApiRoutes = new Router()

webRoutes.use(helmet({
    hsts: false,
    contentSecurityPolicy: false
}))
webRoutes.get('/', (req, res) => {
    res
        .status(200)
        .render('index')
})

apiRoutes.use(helmet({
    hsts: false,
    contentSecurityPolicy: false
}))
apiRoutes.post('/login', require('./controller/login.controller'))
apiRoutes.get('/candidate', require('./controller/candidate.controller'))
apiRoutes.get('/candidate', require('./controller/candidate.controller'))
apiRoutes.get('/vote', require('./middleware/auth.middleware'), require('./controller/vote.controller').read)
apiRoutes.post('/vote', require('./middleware/auth.middleware'), require('./controller/vote.controller').create)
apiRoutes.post('/logout', require('./middleware/auth.middleware'), require('./controller/logout.controller'))

nonScrictApiRoutes.use(
    /** 
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    (req, res, next) => {
        res.set('Cache-Control', ['no-store', 'no-cache', 'must-revalidate'])
        res.set('Pragma', 'no-cache')
        res.set('Expires', '0')
        res.set('ETag', 'false')
        helmet({
            hsts: false,
            contentSecurityPolicy: false,
            
        })
        next()
})
nonScrictApiRoutes.get('/isloggedin', require('./controller/isLoggedIn.controller'))

app.use(webRoutes)
app.use(apiRoutes)
app.use(nonScrictApiRoutes)

// ========================
// Listener
// ========================
app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`))