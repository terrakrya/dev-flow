const mongoose = require('mongoose')
// const ObjectId = mongoose.Schema.Types.ObjectId

const ProfileSchema = mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
    },
    name: String,
    matrixId: String,
    matrixAccessToken: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)
module.exports = Profile
