const User = require('../models/user')
const userMongo = require('../models/user.mongo')

const getAllUsers = () => {
  return User.find({})
}

module.exports = {
  getAllUsers
}