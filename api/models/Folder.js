const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')
const ObjectId = mongoose.Schema.Types.ObjectId

const ProjectSchema = mongoose.Schema(
  {
    organization: {
      type: ObjectId,
      ref: 'Organization',
      required: true,
    },
    creator: { type: ObjectId, ref: 'Profile' },
    folder: { type: ObjectId, ref: 'Folder' },

    title: String,
    content: String,
    tags: [String],
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

const Project =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema)
module.exports = Project
