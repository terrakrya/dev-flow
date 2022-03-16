const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const ObjectId = mongoose.Schema.Types.ObjectId

const ProjectSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
    },
    organization: {
      type: ObjectId,
      ref: 'Organization',
      required: true,
    },
    repository: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
    },
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

ProjectSchema.index({ slug: 1, organization: 1 }, { unique: true })

ProjectSchema.plugin(uniqueValidator, {
  message: 'Este nome já está sendo usado',
})

ProjectSchema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'project',
})

ProjectSchema.plugin(uniqueValidator, {
  message: 'Este nome já está sendo usado',
})

const Project =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema)
module.exports = Project
