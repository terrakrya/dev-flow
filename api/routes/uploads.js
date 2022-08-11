const fs = require('fs')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const axios = require('axios')
// const { PDFImage } = require('pdf-image')

const auth = require('../config/auth')
const uploadFileToS3 = require('../uploadService').uploadFileToS3

const createPath = (path) => {
  !fs.existsSync(path) && fs.mkdirSync(path)
}
const fullBucketProjectPath = process.env.DEFAULT_STORAGE_BUCKET_FULL_URL
const UPLOAD_PATH = 'api/uploads/'

createPath(UPLOAD_PATH)

const imagesPath = () => {
  let path = UPLOAD_PATH
  path += 'images/'
  createPath(path)
  return path
}

const thumbsPath = () => {
  let path = imagesPath()
  path += 'thumbs/'
  createPath(path)
  return path
}

const averagesPath = () => {
  let path = imagesPath()
  path += 'averages/'
  createPath(path)
  return path
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath())
  },
  filename: (req, file, cb) => {
    let filename = file.originalname
    const path = imagesPath()
    if (fs.existsSync(path + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  },
})
const imageUploader = multer({
  storage: imageStorage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
})

router.post(
  '/images',
  [auth.authenticated, imageUploader.single('file')],
  async (req, res) => {
    const filename = req.file.filename
    const original = imagesPath() + filename
    const thumb = thumbsPath() + filename

    await uploadFileToS3({
      filename,
      originalFilePath: original,
      targetFolder: imagesPath(),
    })

    const thumbData = await sharp(original, { failOnError: false })
      .resize({
        width: 400,
        height: 400,
        withoutEnlargement: true,
        fit: sharp.fit.inside,
      })
      .toBuffer()

    await uploadFileToS3({
      filename,
      fileBuffer: thumbData,
      targetFolder: thumbsPath(),
    })

    res.status(201).send({
      title: '',
      url: original,
      thumb,
    })

    const averageData = await sharp(original, { failOnError: false })
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .toBuffer()

    await uploadFileToS3({
      filename,
      fileBuffer: averageData,
      targetFolder: averagesPath(),
    })
  }
)

const documentsPath = () => {
  let path = UPLOAD_PATH
  path += 'documents/'
  createPath(path)
  return path
}

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsPath())
  },
  filename: (req, file, cb) => {
    let filename = file.originalname
    const path = documentsPath()
    if (fs.existsSync(path + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  },
})

const documentUploader = multer({
  storage: documentStorage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
})
router.post(
  '/documents',
  [auth.authenticated, documentUploader.single('file')],
  async (req, res) => {
    const filename = req.file.filename
    const path = documentsPath()

    await uploadFileToS3({
      filename,
      originalFilePath: path + filename,
      targetFolder: path,
    }).catch((error) => {
      res.status(500).send(error)
    })

    res.status(201).send({ title: filename, url: path + filename })

    // PDFImage not working
    // if (filename.endsWith('.pdf')) {
    //   const filenameAsPng = filename.replace('.pdf', '.png')
    //   const thumb = thumbsPath() + filenameAsPng
    //   const average = averagesPath() + filenameAsPng
    //   try {
    //     console.log('thumb', thumb)
    //     const pdfImage = new PDFImage(req.file.path)
    //     const pdfCoverImage = await pdfImage.convertPage(0)
    //     console.log('after', thumb)
    //     const thumbData = await sharp(pdfCoverImage, { failOnError: false })
    //       .resize({
    //         width: 400,
    //         height: 400,
    //         withoutEnlargement: true,
    //         fit: sharp.fit.cover,
    //       })
    //       .toBuffer()

    //     await uploadFileToS3({
    //       filenameAsPng,
    //       fileBuffer: thumbData,
    //       targetFolder: thumbsPath(),
    //     })

    //     const averageData = await sharp(pdfCoverImage, { failOnError: false })
    //       .resize(1600)
    //       .toBuffer()

    //     await uploadFileToS3({
    //       filenameAsPng,
    //       fileBuffer: averageData,
    //       targetFolder: averagesPath(),
    //     })

    //     res.status(201).send({
    //       title: filename,
    //       url: fullBucketProjectPath + path + filename,
    //       average: fullBucketProjectPath + average,
    //       thumb: fullBucketProjectPath + thumb,
    //     })
    //   } catch (error) {
    //     console.log(error)
    //     res.status(201).send({ title: filename, url: path + filename })
    //   }
    // } else {
    // res.status(201).send({ title: filename, url: path + filename })
    // }
  }
)

router.get('/oembed', async (req, res) => {
  const rawData = await axios
    .get(
      'http://open.iframe.ly/api/oembed?url=' +
        req.query.url +
        '&origin=diegomr86'
    )
    .catch(() => {})
  if (rawData && rawData.data) {
    res.json(rawData.data)
  } else {
    res.status(404).send('Não foi possível carregar o conteúdo do link')
  }
})

module.exports = router
