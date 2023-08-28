const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  ownedGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }
  ],
  joinedGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }
  ],
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    console.log('return', returnedObject.ownedGroups)
    //returnedObject.ownedGroups = returnedObject.ownedGroups.map(item => item._id.toString())
    //returnedObject.joinedGroups = returnedObject.joinedGroups.map(item => item.id.toString())
  }
})

mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
