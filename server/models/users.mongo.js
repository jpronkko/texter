const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')

const JoinedGroup = mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  role: {
    type: String,
    enum: ['OWNER', 'ADMIN', 'MEMBER'],
    required: true,
  },
})

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20,
    validate: {
      validator: validator.isEmail,
    },
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 5,
  },
  groups: [JoinedGroup],
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

    if (returnedObject.groups) {
      returnedObject.groups = returnedObject.groups.map((item) => {
        return {
          id: item._id.toString(),
          group: item.group,
          role: item.role,
        }
      })
    }
  },
})

mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
