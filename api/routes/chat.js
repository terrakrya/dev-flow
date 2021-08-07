import { registerMatrixUser, createRoom } from '../matrixService'
const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')
const { authenticated } = require('../config/auth')

const Profile = mongoose.model('Profile')
const Organization = mongoose.model('Organization')

router.get('/:organizationId/rooms', (req, res) => {
  // Por hora, esse é o id do github
  Organization.findOne({ githubId: req.params.organizationId }).exec(
    (err, organization) => {
      console.log('organization', organization)

      if (err) {
        res.status(422).send(err.message)
      } else if (organization && organization.matrixRooms) {
        res.json({ rooms: organization.matrixRooms })
      } else {
        res.json({ rooms: [] })
      }
    }
  )
})

router.post('/:organizationId/rooms', (req, res) => {
  Organization.findOneAndUpdate(
    { githubId: req.params.organizationId },
    { githubId: req.params.organizationId },
    { upsert: true },
    (err, organization) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        console.log('reqi', req.body)
        createRoom({ name: req.body.name, topic: req.body.topic })
          .then((room) => {
            organization.matrixRooms = [
              ...organization.matrixRooms,
              room.room_id,
            ]
            organization
              .save()
              .then((organization) =>
                res.json({ rooms: organization.matrixRooms })
              )
          })
          .catch((err) => res.status(422).send(err))
        // organization.matrixRooms = [
        //   ...organization.matrixRooms,
        //   req.body.newRoomId,
        // ]
        // organization
        //   .save()
        //   .then((updatedOrganizaton) => res.json(updatedOrganizaton))
        //   .catch((err) => res.status(422).send(err.message))
      }
    }
  )
})

// Mudar para pegar o githubid direto do usuário

router.post('/:githubId/activateChat', authenticated, function (req, res) {
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

router.put('/:githubId/activateChat', authenticated, function (req, res) {
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
