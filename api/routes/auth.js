import '../config/passport'
import passport from 'passport'
import { registerMatrixUser } from '../matrixService'

const router = require('express').Router()

// const mongoose = require('mongoose')
// const Profile = mongoose.model('Profile')
const Profile = require('../models/Profile')

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

router.post('/:githubId/activateChat', function (req, res) {
  Profile.findOne({ githubId: req.params.githubId }).exec(
    async (err, profile) => {
      if (err) {
        res.status(422).send(err.message)
      } else if (profile.matrixAccessToken !== undefined) {
        console.log('Já tinha', profile.matrixAccessToken)
        res.send(profile)
      } else {
        try {
          const newMatrixUser = await registerMatrixUser()

          profile.matrixId = newMatrixUser.user_id
          profile.matrixAccessToken = newMatrixUser.access_token
          await profile.save()

          res.send(profile)
        } catch (error) {
          res.status(500).send(err)
        }
      }
    }
  )
})

router.put('/:githubId/activateChat', function (req, res) {
  Profile.findOne({ githubId: req.params.githubId }).exec(
    async (err, profile) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        try {
          const newMatrixUser = await registerMatrixUser()
          console.log('criou um novo?', newMatrixUser)
          profile.matrixId = newMatrixUser.user_id
          profile.matrixAccessToken = newMatrixUser.access_token
          await profile.save()

          res.send(profile)
        } catch (error) {
          res.status(500).send(err)
        }
      }
    }
  )
})

module.exports = router
