const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')
const ObjectId = mongoose.Schema.Types.ObjectId

const NoteSchema = mongoose.Schema(
  {
    organization: {
      type: ObjectId,
      ref: 'Organization',
      required: true,
    },
    creator: { type: ObjectId, ref: 'Profile' },
    project: { type: ObjectId, ref: 'Project' },
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

NoteSchema.virtual('folder', {
  ref: 'Child',
  localField: '_id',
  foreignField: 'item',
  // match: { type: 'Note' },
})

const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema)
module.exports = Note
module.exports = NoteSchema
