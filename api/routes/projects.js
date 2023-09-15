const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const slugify = require('slugify')
const { authenticated } = require('../config/auth')
const Project = mongoose.model('Project')

router.get('/', authenticated, (req, res) => {
  Project.find({ archived: false }).exec((err, projects) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(projects)
    }
  })
})

router.get('/:id', authenticated, (req, res) => {
  const query = { $or: [{ slug: req.params.id }, { _id: req.params.id }] }
  Project.findOne(query).exec((err, project) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(project)
    }
  })
})

router.post('/', authenticated, (req, res) => {
  const newProject = new Project(req.body)
  newProject.slug = slugify(newProject.name).toLowerCase()
  newProject.save((err, project) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(project)
    }
  })
})

router.put('/:id', authenticated, (req, res) => {
  const params = req.body
  params.slug = slugify(params.name).toLowerCase()
  const query = { $or: [{ slug: req.params.id }, { _id: req.params.id }] }
  Project.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
    },
    (err, project) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(project)
      }
    }
  )
})

router.delete('/:id', authenticated, (req, res) => {
  const query = { $or: [{ slug: req.params.id }, { _id: req.params.id }] }

  Project.findOne(query).exec(async (err, project) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      project.archived = true
      await project.save()
      res.send(project)
    }
  })
})

module.exports = router
