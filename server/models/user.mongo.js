const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4
  },
  username: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('User', schema)
