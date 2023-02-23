const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Folder = mongoose.model('Folder')

router.get('/', authenticated, (req, res) => {
  const query = { organization: req.query.organization }

  Folder.find(query)
    .populate({ path: 'creator', select: 'name' })
    .populate('children')
    .sort('order')
    .exec((err, folders) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(folders)
      }
    })
})

router.get('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }
  Folder.findOne(query)
    .populate({ path: 'creator', select: 'name' })
    .populate({
      path: 'notes.item',
    })
    .exec((err, folder) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(folder)
      }
    })
})

router.post('/', authenticated, (req, res) => {
  const newFolder = new Folder(req.body)
  newFolder.save((err, folder) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(folder)
    }
  })
})

router.put('/:id', authenticated, (req, res) => {
  const params = req.body
  const query = { _id: req.params.id }
  Folder.findOneAndUpdate(
    query,
    {
      $set: params, // this needs to be validated (joi,express-validator?)
    },
    {
      upsert: true,
      new: true,
    },
    (err, folder) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(folder)
      }
    }
  )
})

router.put('/:id/addChild', authenticated, (req, res) => {
  // we should be validating, ChildSchema
  const query = { _id: req.params.id }
  const params = req.body
  const child = {
    label: params.label,
    type: params.type,
    item: params.item,
    order: params.order,
  }
  Folder.findOneAndUpdate(
    query,
    {
      // add child to children array
      $push: { children: child },
    },
    {
      new: true,
    },
    (err, folder) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(folder)
      }
    }
  )
})

router.delete('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }

  Folder.findOneAndDelete(query, (err, folder) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(folder)
    }
  })
})

module.exports = router
