import '../config/passport'
import passport from 'passport'

const router = require('express').Router()

// const mongoose = require('mongoose')
// const Profile = mongoose.model('Profile')

router.get('/github', passport.authenticate('github'))

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=true' }),
  function (req, res) {
    res.redirect('/login')
  }
)

router.get('/me', function (req, res) {
  res.send(req.user)
})

router.post('/login', function (req, res) {
  res.send(req.user)
})

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
