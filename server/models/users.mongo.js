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
  password: {
    type: String,
    required: true,
    minlength: 4
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

mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
