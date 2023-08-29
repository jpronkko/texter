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
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'CANCELLED', 'REJECTED'],
    required: true,
  },
  sentTime: {
    type: Date,
    required: true,
  }
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    returnedObject.fromUser = returnedObject.fromUser.toString()
    returnedObject.toUser = returnedObject.toUser.toString()
  }
})

module.exports = mongoose.model('Invitation', schema)
