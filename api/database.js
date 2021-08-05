import mongoose from 'mongoose'

import './models/Project'
import './models/Card'
import './models/Comment'
import './models/Profile'
import './models/Organization'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
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
    }
  )
  mongoose.set('debug', true)
}
