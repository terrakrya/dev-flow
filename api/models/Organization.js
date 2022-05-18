const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const OrganizationSchema = mongoose.Schema(
  {
    githubId: String,
    matrixRooms: [String],
    avatarUrl: String,
    mainRoom: String,
    creator: String,
    name: String,
    members: [
      {
        type: ObjectId,
        ref: 'Profile',
      },
    ],
    description: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

OrganizationSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'organization',
  justOne: false, // set true for one-to-one relationship
})

const Organization =
  mongoose.models.Organization ||
  mongoose.model('Organization', OrganizationSchema)
module.exports = Organization
