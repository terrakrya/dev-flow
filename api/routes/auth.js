const router = require('express').Router()

router.get('/current', isLoggedIn, function (req, res) {
  res.send(req.session.user)
  res.send(req.session.user)
})

function isLoggedIn(req, res, next) {
  console.log(req.isAuthenticated())
  console.log(this.$auth)
  if (req.isAuthenticated()) return next()
  res.status(401).send('User not logged in')
}

module.exports = router
