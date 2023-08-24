const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    enum: ['PENDING', 'ACCEPTED', 'CANCELLED', 'REJECTED'],
    required: true,
  },
  sentTime: {
    type: Date,
    required: true,
  }
})

module.exports = mongoose.model('Invitation', schema)
