import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'

const app = express()
const router = express.Router()
const secret = process.env.SECRET || 'dev-flow'

app.use(
  session({
    secret,
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: false,
  })
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)

router.use('/auth', require('./routes/auth'))

module.exports = {
  path: '/api',
  handler: app,
}
