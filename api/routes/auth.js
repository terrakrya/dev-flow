import '../config/passport'
import passport from 'passport'
const router = require('express').Router()

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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.status(401).send('User not logged in')
}

module.exports = router
