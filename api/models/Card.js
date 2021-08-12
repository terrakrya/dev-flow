const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const CardSchema = mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    project: {
      type: ObjectId,
      ref: 'Project',
      required: true,
    },
    members: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    test_instructions: {
      type: String,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: Array,
    },
    images: {
      type: Array,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)
const Card = mongoose.models.Card || mongoose.model('Card', CardSchema)
module.exports = Card
