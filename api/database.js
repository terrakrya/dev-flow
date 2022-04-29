import fs from 'fs'
import mongoose from 'mongoose'
import './models/Note'
import './models/Project'
import './models/Card'
import './models/Comment'
import './models/Profile'
import './models/Organization'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  // Create certificate file from env var (because mongoose doesnt accept cert data directly)
  fs.writeFileSync('./api/config/mongodb.ca.crt', process.env.MONGO_CA_CERT)

  mongoose.connect(process.env.MONGODB_URI, {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
} else {
  mongoose.connect(
    'mongodb://127.0.0.1:27017/' + process.env.npm_package_name,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    }
  )
  mongoose.set('debug', true)
}
