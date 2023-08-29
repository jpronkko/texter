const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    }
  ]
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    returnedObject.ownerId = returnedObject.ownerId.toString()
    returnedObject.topics = returnedObject.topics
      .map(topic => {
        return {
          id: topic._id?.toString(),
          ownerId: topic.ownerId?.toString(),
          messages: topic.messages
        }
      })
  }
})


module.exports = mongoose.model('Group', schema)
