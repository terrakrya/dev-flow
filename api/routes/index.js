const router = require('express').Router()

// router.get('/events', (req, res) => {
//   const { Octokit } = require('@octokit/rest')

//   const octokit = new Octokit({
//     auth: req.query.auth,
//   })

//   octokit.activity
//     .listOrgEventsForAuthenticatedUser({
//       username: 'diegomr86',
//       org: 'terrakrya',
//     })
//     .then((resp) => {
//       res.send(resp)
//     })
//     .catch((err) => {
//       res.status(500).send(err)
//     })
// })

router.use('/auth', require('./auth'))
router.use('/uploads', require('./uploads'))
router.use('/projects', require('./projects'))
router.use('/cards', require('./cards'))
router.use('/comments', require('./comments'))
router.use('/organizations', require('./organizations'))
router.use('/chat', require('./chat'))
router.use('/notes', require('./notes'))

export default router
