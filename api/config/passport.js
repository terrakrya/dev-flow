import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    },
    (accessToken, refreshToken, profile, cb) => {
      const user = { token: accessToken, ...profile._json }
      // user.refreshToken = refreshToken
      return cb(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
