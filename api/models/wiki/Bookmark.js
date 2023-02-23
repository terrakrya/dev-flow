const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const BookmarkSchema = mongoose.Schema(
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
    shouldEmbed: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

BookmarkSchema.virtual('folder', {
  ref: 'Child',
  localField: '_id',
  foreignField: 'item',
})

const Bookmark =
  mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema)
module.exports = Bookmark
