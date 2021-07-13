const fs = require('fs')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { authenticated } = require('../config/auth')

const UPLOAD_PATH = 'api/uploads/'
const ATTACHMENTS_PATH = UPLOAD_PATH + 'attachments/'
const THUMBS_PATH = UPLOAD_PATH + 'thumbs/'
!fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH)
!fs.existsSync(ATTACHMENTS_PATH) && fs.mkdirSync(ATTACHMENTS_PATH)
!fs.existsSync(THUMBS_PATH) && fs.mkdirSync(THUMBS_PATH)

const attachmentStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, ATTACHMENTS_PATH)
  },
  filename(req, file, cb) {
    let filename = file.originalname
    if (fs.existsSync(ATTACHMENTS_PATH + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  },
})
const attachmentUploader = multer({
  storage: attachmentStorage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
})

router.post(
  '/upload',
  [authenticated, attachmentUploader.single('attachment')],
  (req, res) => {
    const url = req.file.filename
    const original = ATTACHMENTS_PATH + url
    const thumb = THUMBS_PATH + url

    console.log(req.file)
    sharp(original)
      .resize({
        width: 200,
        height: 200,
        withoutEnlargement: true,
        fit: sharp.fit.cover,
      })
      .toFile(thumb, function (err) {
        if (!err) {
          res.status(201).send({
            url: '/' + original,
            thumb: '/' + thumb,
          })
        }
      })
  }
)

module.exports = router
