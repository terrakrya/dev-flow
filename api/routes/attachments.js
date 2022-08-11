const fs = require('fs')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { authenticated } = require('../config/auth')
const { uploadFileToS3 } = require('../uploadService')

const fullBucketProjectPath = process.env.DEFAULT_STORAGE_BUCKET_FULL_URL

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
  async (req, res) => {
    const filename = req.file.filename

    await uploadFileToS3({
      filename,
      originalFilePath: ATTACHMENTS_PATH + filename,
      targetFolder: ATTACHMENTS_PATH,
    }).catch((error) => {
      res.status(500).send(error)
    })

    const thumbData = sharp(ATTACHMENTS_PATH + filename)
      .resize({
        width: 200,
        height: 200,
        withoutEnlargement: true,
        fit: sharp.fit.cover,
      })
      .toBuffer()

    await uploadFileToS3({
      filename,
      fileBuffer: thumbData,
      targetFolder: THUMBS_PATH,
    })

    res.status(201).send({
      title: filename,
      url: ATTACHMENTS_PATH + filename,
      thumb: THUMBS_PATH + filename,
    })
  }
)

module.exports = router
