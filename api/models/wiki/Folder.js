const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const ChildSchema = new mongoose.Schema({
  label: String,
  type: {
    type: String,
    enum: ['Folder', 'Note', 'Bookmark, File'],
    required: true,
  },
  item: {
    type: ObjectId,
    refpath: 'type',
    required: true,
  },
  order: Number,
})

const FolderSchema = mongoose.Schema(
  {
    organization: {
      type: ObjectId,
      ref: 'Organization',
      required: true,
    },
    creator: { type: ObjectId, ref: 'Profile' },
    label: String,
    children: {
      type: [ChildSchema],
    },
    tags: [String],
    allowedTypes: [String],
    root: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

FolderSchema.virtual('folder', {
  ref: 'Child',
  localField: '_id',
  foreignField: 'item',
  // should set justOne? or leave it many-to-many
})

// should probally be used for base model
// ChildSchema.set('discriminatorKey', 'type')
// ChildSchema.discriminator('NoteChild', NoteSchema)
// ChildSchema.discriminator('FolderChild', FolderSchema)
// ChildSchema.discriminator('BookmarkChild', BookmarkSchema)

const Folder = mongoose.models.Folder || mongoose.model('Folder', FolderSchema)
// const Child = mongoose.models.Child || mongoose.model('Child', ChildSchema)
module.exports = Folder
// module.exports = Child
