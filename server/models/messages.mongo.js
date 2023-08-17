const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  sentTime: {
    type: Date,
    required: true,
  }
})

module.exports = mongoose.model('Message', schema)
