const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  fromUser: {
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
  },
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.topicId = returnedObject.topicId.toString()
    if (returnedObject.fromUser._id) {
      returnedObject.fromUser = returnedObject.fromUser.toJSON()
    } else {
      returnedObject.fromUser = returnedObject.fromUser.toString()
    }
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('Message', schema)
