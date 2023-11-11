const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUserId: {
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
    returnedObject.groupId = returnedObject.groupId.toString()
    returnedObject.fromUserId = returnedObject.fromUserId.toString()
    returnedObject.toUserId = returnedObject.toUserId.toString()
  }
})

module.exports = mongoose.model('Invitation', schema)
