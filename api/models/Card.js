const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const CardSchema = mongoose.Schema(
  {
    organization: {
      type: ObjectId,
      ref: 'Organization',
      required: true,
    },
    project: {
      type: ObjectId,
      ref: 'Project',
      required: true,
    },
    members: [
      {
        type: ObjectId,
        ref: 'Profile',
        required: true,
      },
    ],
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
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
    order: {
      type: Number,
      default: 0,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    due_date: {
      type: Date,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    time_estimate: {
      type: Number, // hours
    },
    time_spent: {
      type: Number, // hours
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)
const Card = mongoose.models.Card || mongoose.model('Card', CardSchema)
module.exports = Card
