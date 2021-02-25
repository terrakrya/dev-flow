const mongoose = require('mongoose')

const ProjectSchema = mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

ProjectSchema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'project',
})

const Project =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema)
module.exports = Project
