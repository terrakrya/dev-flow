const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const FileSchema = mongoose.Schema(
  {
    organization: {
      type: ObjectId,
      ref: 'Organization',
      required: true,
    },
    creator: {
      type: ObjectId,
      ref: 'Profile',
    },
    project: {
      type: ObjectId,
      ref: 'Project',
    },
    label: String,
    description: String,
    mimeType: String,
    fileFormat: String,
    fullPath: String,
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

FileSchema.virtual('folder', {
  ref: 'Child',
  localField: '_id',
  foreignField: 'item',
})

const File = mongoose.models.File || mongoose.model('File', FileSchema)
module.exports = File
