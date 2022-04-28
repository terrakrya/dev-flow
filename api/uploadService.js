import fs from 'fs'
import { S3, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Config = {
  defaultBucket: process.env.DEFAULT_STORAGE_BUCKET,
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
}
const s3Client = new S3({
  endpoint: process.env.STORAGE_BUCKET_ENDPOINT,
  region: 'us-east-1',
  credentials: s3Config.credentials,
})

export const uploadFileToS3 = async ({
  filename,
  originalFilePath,
  targetFolder,
  fileBuffer,
}) => {
  // get file from path
  const fileData = fileBuffer || fs.readFileSync(originalFilePath)

  const params = {
    Bucket: s3Config.defaultBucket,
    Key:
      process.env.DEFAULT_STORAGE_BUCKET_ROOT_FOLDER + targetFolder + filename,
    Body: fileData,
    ACL: 'public-read',
  }

  try {
    const requestData = await s3Client.send(new PutObjectCommand(params))
    return requestData
  } catch (error) {
    console.log(error)
  }
}
