import '../config/passport'
import passport from 'passport'
import Profile from '../models/Profile'
const router = require('express').Router()
const { authenticated } = require('../config/auth')

// const mongoose = require('mongoose')
// const Profile = mongoose.model('Profile')

router.get('/github', passport.authenticate('github'))

router.post('/register', async (req, res) => {
  // console.log('req', req)
  const user = new Profile({ email: req.body.email })
  user.setPassword(req.body.password)
  try {
    await user.save()
    console.log('user', user)
    res.status(200).send(user.toJSON())
  } catch (error) {
    console.log('usererr', error)

    res.status(422).send(error)
  }
})

router.post('/login/password', function (req, res, next) {
  if (!req.body.email) {
    return res.status(422).json('Insira um nome de usuário ou email')
  }

  if (!req.body.password) {
    return res.status(422).json('Insira sua senha')
  }

  passport.authenticate(
    'local',
    {
      session: true,
    },
    function (err, user, info) {
      if (err) {
        return next(err)
      }

      if (user) {
        user.token = user.generateJWT()
        return res.json(user.toAuthJSON())
      } else {
        return res.status(422).json('Usuário ou senha inválidos')
      }
    }
  )(req, res, next)
})

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=true' }),
  function (req, res) {
    res.redirect('/login')
  }
)

router.get('/me', authenticated, function (req, res) {
  Profile.findOne({ email: req.user.email })
    .populate({ path: 'organizations', populate: { path: 'members' } })
    .populate('network')
    .exec(function (err, user) {
      if (!err && user) {
        res.send(user.toJSON())
      } else {
        res.status(422).send('Usuário não encontrado')
      }
    })
})

router.post('/login', function (req, res) {
  res.send(req.user)
})

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
