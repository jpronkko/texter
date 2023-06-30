const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  body: {
    type: String,
    required: true,
  },
})


module.exports = mongoose.model('Message', schema)
