const mongoose = require('mongoose')

const schema = new mongoose.Schema({
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
  }
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    //returnedObject.fromUser = returnedObject.fromUser.toString()
  }
})
module.exports = mongoose.model('Message', schema)
