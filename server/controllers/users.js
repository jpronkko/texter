const User = require('../models/user')
const userMongo = require('../models/users.mongo')

const getAllUsers = () => {
  return User.find({})
}

module.exports = {
  getAllUsers
}