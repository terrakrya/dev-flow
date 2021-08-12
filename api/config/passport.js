import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
const Profile = require('../models/Profile')

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    },
    (accessToken, refreshToken, ghProfile, cb) => {
      Profile.findOneAndUpdate(
        { githubId: ghProfile.id },
        { githubId: ghProfile.id, name: ghProfile._json.name },
        { upsert: true, new: true, lean: true },
        (err, profile) => {
          const user = { token: accessToken, ...ghProfile._json, ...profile }
          return cb(err, user)
        }
      )
      // user.refreshToken = refreshToken
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
