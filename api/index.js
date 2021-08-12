import './database'
import path from 'path'

import cors from 'cors'
import express from 'express'
import passport from 'passport'
import session from 'express-session'
import routes from './routes'

const app = express()
const secret = process.env.SECRET || process.env.npm_package_name
console.log('EVNV', process.env.GITHUB_ID)

app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(
  session({
    secret,
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: false,
  })
)
app.use(express.urlencoded({ extended: false, limit: '100mb' }))
app.use(express.json({ limit: '100mb' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(routes)

module.exports = {
  path: '/api',
  handler: app,
}
