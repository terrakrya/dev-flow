const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Bookmark = mongoose.model('Bookmark')

router.get('/', authenticated, (req, res) => {
  const query = { archived: false }
  if (req.query.project) {
    query.project = req.query.project
  }
  if (req.query.organization) {
    query.organization = req.query.organization
  }

  // folder
  Bookmark.find(query)
    .sort('order')
    .exec((err, cards) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(cards)
      }
    })
})

router.get('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }
  Bookmark.findOne(query).exec((err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(card)
    }
  })
})

router.post('/', authenticated, (req, res) => {
  const newBookmark = new Bookmark(req.body)
  newBookmark.save((err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(card)
    }
  })
})

router.put('/:id', authenticated, (req, res) => {
  const params = req.body
  const query = { _id: req.params.id }
  Bookmark.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
      new: true,
    },
    (err, card) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(card)
      }
    }
  )
})

router.delete('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }

  Bookmark.findOne(query).exec(async (err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      card.archived = true
      await card.save()
      res.send(card)
    }
  })
})

module.exports = router
