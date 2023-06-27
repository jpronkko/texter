const User = require('../models/user')

const getAllUsers = () => {
  return User.find({})
}

module.exports = {
  getAllUsers
}