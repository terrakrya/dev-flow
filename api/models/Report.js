const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const ReportSchema = mongoose.Schema(
  {
    project: {
      type: ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)
const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema)
module.exports = Report
