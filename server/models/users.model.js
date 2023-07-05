const logger = require('../utils/logger')

const User = require('./users.mongo')

const findUser = async (username) => {
  return await User.findOne({ username })
}

const getAllUsers = async () => {
  return await User.find({}, { 'passwordHash': 0, '__v': 0 })
}

const createUser = async (name, username, passwordHash, email) => {
  logger.info('Create user mongo', name, username, passwordHash, email)
  const user = new User({ name, username, passwordHash, email })
  const result = await user.save()
  logger.info('Trying create user save', result)
  return result
}

module.exports = {
  findUser,
  getAllUsers,
  createUser,
}
