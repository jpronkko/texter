const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  username: {
    type: String,
    required: true,
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
    minlength: 4,
  }
})


module.exports = mongoose.model('User', schema)
