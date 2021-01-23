import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import routes from './routes'

const app = express()
const secret = process.env.SECRET || 'dev-flow'

app.use(cors())

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

app.use(routes)

module.exports = {
  path: '/api',
  handler: app,
}
