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
      ref: 'Card',
      required: true,
    },
    users: [
      {
        type: String,
        required: true,
      },
    ],
    column: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    note: {
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
const Card = mongoose.models.Card || mongoose.model('Card', CardSchema)
module.exports = Card
