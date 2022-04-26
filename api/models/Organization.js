const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const OrganizationSchema = mongoose.Schema(
  {
    githubId: String,
    matrixRooms: [String],
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

OrganizationSchema.methods.addMember = (memberEmail) => {
  if (!this.members) this.members = []
  if (!this.members?.includes(memberEmail)) {
    this.members.push(memberEmail)
    console.log('addmember', this.members)
    return this
  } else {
    console.log('Member already joined')
  }
}

const Organization =
  mongoose.models.Organization ||
  mongoose.model('Organization', OrganizationSchema)
module.exports = Organization
