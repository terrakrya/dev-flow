const crypto = require('crypto')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const jwt = require('jsonwebtoken')

const secret = process.env.SECRET || process.env.npm_package_name

// const ObjectId = mongoose.Schema.Types.ObjectId

const ProfileSchema = mongoose.Schema(
  {
    githubId: {
      type: String,
      required: false,
    },
    name: String,
    avatarUrl: String,
    matrixId: String,
    matrixAccessToken: String,
    username: {
      type: String,
      // lowercase: true,
      unique: false,
      required: false,
      // // match: [/^[a-zA-Z0-9]+$/, 'inválido'],
      // index: true,
    },
    email: {
      type: String,
      lowercase: true,
      // match: [/\S+@\S+\.\S+/, 'inválido'],
      index: true,
      required: true,
    },
    organizations: [
      {
        type: ObjectId,
        ref: 'Organization',
      },
    ],
    hash: String,
    salt: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

ProfileSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  console.log('validPassword', hash === this.hash)
  return this.hash === hash
}

ProfileSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

ProfileSchema.methods.addOrganization = (organizationId) => {
  if (!this.organizations) this.organizations = []

  if (!this.organizations.includes(organizationId)) {
    this.organizations.push(organizationId)
  } else {
    console.log('Organization already joined')
  }
}

ProfileSchema.methods.data = function () {
  return {
    _id: this._id,
    // username: this.username,
    email: this.email,
  }
}

ProfileSchema.methods.generateJWT = function () {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      ...this.data(),
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  )
}

ProfileSchema.methods.toAuthJSON = function () {
  return {
    ...this.data(),
    token: this.generateJWT(),
  }
}

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)
module.exports = Profile
