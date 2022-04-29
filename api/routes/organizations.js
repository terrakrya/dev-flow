const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Profile = require('../models/Profile')
const Organization = mongoose.model('Organization')
const Project = mongoose.model('Project')

// router.get('/', authenticated, (req, res) => {
//   Organization.findOne(
//     { githubId: req.user.organization },
//     { githubId: req.user.organization },
//     { upsert: true, new: true }
//   ).exec((err, organization) => {
//     if (err) {
//       res.status(422).send(err.message)
//     } else {
//       res.json(organization)
//     }
//   })
// })

router.put('/:id', authenticated, (req, res) => {
  const params = req.body
  const query = { _id: req.params.id }

  Organization.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
      new: true,
    }
  )
    .populate('members')
    .exec((err, updatedOrganization) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(updatedOrganization)
      }
    })
})

router.post('/:id/leave', authenticated, (req, res) => {
  const orgId = req.params.id
  const userId = req.user._id

  // TODO: isso deveria acontecer numa transação só para evitar desencontro de informação?
  try {
    Organization.findByIdAndUpdate(
      orgId,
      { $pull: { members: userId } },
      (err, organization) => {
        if (err) {
          res.status(422).send(err)
        }

        Profile.findByIdAndUpdate(
          userId,
          { $pull: { organizations: orgId } },
          (err, profile) => {
            if (err) {
              res.status(422).send(err)
            }

            res.status(200).send()
          }
        )
      }
    )
  } catch (err) {
    res.status(422).send(err)
  }
})

router.post('/:id/join', authenticated, (req, res) => {
  const orgId = req.params.id
  const userId = req.user._id

  try {
    Organization.findByIdAndUpdate(
      orgId,
      { $push: { members: userId } },
      (err, organization) => {
        if (err) {
          res.status(422).send(err)
        }

        Profile.findByIdAndUpdate(
          userId,
          { $push: { organizations: orgId } },
          (err, profile) => {
            if (err) {
              res.status(422).send(err)
            }

            res.status(200).send()
          }
        )
      }
    )
  } catch (err) {
    res.status(422).send(err)
  }
})

router.post('/new', authenticated, async (req, res) => {
  try {
    let newOrganization = new Organization({
      name: req.body.name,
      description: req.body.description,
      members: [req.user._id],
      creator: req.user.email,
    })

    newOrganization = await newOrganization.save()

    Profile.findByIdAndUpdate(
      req.user._id,
      { $push: { organizations: newOrganization._id } },
      (err, profile) => {
        if (err) {
          res.status(422).send(err)
        }
        newOrganization.members = [profile] // add populated member to response
        res.send(newOrganization)
      }
    )
  } catch (err) {
    res.status(422).send(err)
  }
})

router.get('/:id/projects', authenticated, (req, res) => {
  Project.find({ organization: req.params.id, archived: false }).exec(
    (err, projects) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(projects)
      }
    }
  )
})

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
