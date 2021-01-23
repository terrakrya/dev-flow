const router = require('express').Router()

router.get('/events', (req, res) => {
  const { Octokit } = require('@octokit/rest')

  console.log(req.query.auth)
  const octokit = new Octokit({
    auth: req.query.auth,
  })

  octokit.activity
    .listOrgEventsForAuthenticatedUser({
      username: 'diegomr86',
      org: 'terrakrya',
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

router.use('/auth', require('./auth'))

export default router
