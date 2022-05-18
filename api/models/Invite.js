const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const InviteSchema = mongoose.Schema(
  {
    organization: {
      type: ObjectId,
      ref: 'Organization',
      required: true,
    },
    expirationDate: Date,
    singleUse: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)
const Invite = mongoose.models.Invite || mongoose.model('Invite', InviteSchema)
module.exports = Invite
