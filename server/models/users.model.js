const logger = require('../utils/logger')

const User = require('./users.mongo')
const { pwCompare, tokenFromUser } = require('../utils/pwtoken')

const findUser = async (username) => {
  return await User.findOne({ username })
}

const findUserWithId = async (userId) => {
  return User.findOne({ _id: userId })
}

const getAllUsers = async () => {
  return await User.find({}, { 'passwordHash': 0, '__v': 0 })
}

const createUser = async (name, username, passwordHash, email) => {
  const user = new User({ name, username, passwordHash, email })
  const result = await user.save()
  logger.info('Trying create user save', result)
  return result
}

const login = async (username, password) => {
  logger.info('Login with username', username, 'password', password)
  const user = await User.findOne({ username })

  if(!user) {
    throw new Error('No such user')
  }
  const passwordCorrect = await pwCompare(password, user.passwordHash)
  logger.info('PW correct', passwordCorrect)

  if (!passwordCorrect) {
    throw new Error( 'Wrong credentials')
  }

  //throw new Error('Login error!')

  return tokenFromUser(user)
}

module.exports = {
  findUser,
  findUserWithId,
  getAllUsers,
  createUser,
  login,
}
