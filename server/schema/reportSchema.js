const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
