const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Organization = mongoose.model('Organization')

router.get('/', authenticated, (req, res) => {
  Organization.findOneAndUpdate(
    { githubId: req.user.organization },
    { githubId: req.user.organization },
    { upsert: true, new: true }
  ).exec((err, organization) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(organization)
    }
  })
})

router.put('/:id', authenticated, (req, res) => {})

// router.get('/:id', authenticated, (req, res) => {
//   const query = { _id: req.params.id }
//   Comment.findOne(query).exec((err, comment) => {
//     if (err) {
//       res.status(422).send(err.message)
//     } else {
//       res.json(comment)
//     }
//   })
// })

// router.post('/', authenticated, (req, res) => {
//   const newComment = new Comment(req.body)
//   newComment.member = req.user.id
//   newComment.save((err, comment) => {
//     if (err) {
//       res.status(422).send(err.message)
//     } else {
//       res.send(comment)
//     }
//   })
// })

// router.put('/:id', authenticated, (req, res) => {
//   const params = req.body
//   const query = { _id: req.params.id, member: req.user.id }
//   Comment.findOneAndUpdate(
//     query,
//     {
//       $set: params,
//     },
//     {
//       upsert: true,
//     },
//     (err, comment) => {
//       if (err) {
//         res.status(422).send(err.message)
//       } else {
//         res.send(comment)
//       }
//     }
//   )
// })

// router.delete('/:id', authenticated, (req, res) => {
//   const query = { _id: req.params.id }

//   Comment.findOne(query).exec(async (err, comment) => {
//     if (err) {
//       res.status(422).send(err.message)
//     } else {
//       comment.archived = true
//       await comment.save()
//       res.send(comment)
//     }
//   })
// })

module.exports = router
