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
    folder: { type: ObjectId, ref: 'Folder' },
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

const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema)
module.exports = Note
