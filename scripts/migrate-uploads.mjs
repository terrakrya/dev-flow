// rewrite imports to module api (import)
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { uploadFileToS3 } from '../api/uploadService.js'
// const { uploadFileToS3 } = pkg

const UPLOAD_PATH = 'api/uploads/'
const LOCAL_PATH = '../api/uploads/documents/'

const type = 'document'

const imagesPath = () => {
  let path = UPLOAD_PATH
  path += 'documents/'
  return path
}

const thumbsPath = () => {
  let path = imagesPath()
  path += 'thumbs/'
  return path
}

const averagesPath = () => {
  let path = imagesPath()
  path += 'averages/'
  return path
}
const call = async () => {
  // Our starting point
  try {
    // Get the files as an array
    const files = await fs.promises.readdir(LOCAL_PATH)

    // Loop them all with the new for...of
    console.log(`Found ${files.length} files at `, LOCAL_PATH)
    let count = 0
    for (const file of files) {
      // Get the full paths
      const fromPath = path.join(LOCAL_PATH, file)
      //   const toPath = path.join(moveTo, file)

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fromPath)

      if (stat.isFile()) {
        // upload
        console.log("'%s' is a file.", file, fromPath)
        const filename = file
        const original = LOCAL_PATH + filename
        const thumb = thumbsPath() + filename

        await uploadFileToS3({
          filename,
          originalFilePath: original,
          targetFolder: imagesPath(),
        })

        if (type === 'image') {
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
        count += 1

        console.log(`Uploaded ${count}/${files.length}`, {
          title: '',
          url: original,
          thumb,
        })
      } else if (stat.isDirectory()) console.log('%s is a directory.', fromPath)
      // console.log( "'%s' is a directory.", fromPath );

      // Now move async
      // await fs.promises.rename( fromPath, toPath );

      // Log because we're crazy
      // console.log( "Moved '%s'->'%s'", fromPath, toPath );
    } // End for...of
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e)
  }
}

call()
