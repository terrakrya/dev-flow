const mongoose = require('mongoose')
// const ObjectId = mongoose.Schema.Types.ObjectId

const OrganizationSchema = mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
    },
    matrixRooms: [String],
    mainRoom: [],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

const Organization =
  mongoose.models.Organization ||
  mongoose.model('Organization', OrganizationSchema)
module.exports = Organization
