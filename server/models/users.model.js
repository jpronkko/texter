const logger = require('../utils/logger')

const User = require('./users.mongo')
const { pwCompare, tokenFromUser } = require('../utils/pwtoken')

const findUser = async (username) => {
  return await User.findOne({ username })
}

const findUserWithId = async (userId) => {
  return User.findOne({ _id: userId }).populate('ownedGroups').populate('joinedGroups')
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
  const user = await User.findOne({ username }).populate('ownedGroups').populate('joinedGroups')

  if(!user) {
    throw new Error('No such user')
  }
  const passwordCorrect = await pwCompare(password, user.passwordHash)
  logger.info('PW correct', passwordCorrect)

  if (!passwordCorrect) {
    throw new Error( 'Wrong credentials')
  }

  return { token: tokenFromUser(user), user }
}

const addUserToGroup = async (userId, groupId) => {
  const user = await User.findById(userId)
  logger.info('user in add to group', userId, user)
  user.joinedGroups = user.joinedGroups.concat(groupId)
  const updatedUser = (await user.save()).populate('joinedGroups')
  return updatedUser
}

/* Do we need this: */
const getUserGroups = async (userId) => {
  const result = await User.findById(userId).select({ 'joinedGroups': 1, 'ownedGroups': 1 }).populate('joinedGroups').populate('ownedGroups')
  console.log('Group infos', result)
  console.log(JSON.stringify(result.ownedGroups))
  return { ownedGroups: result.ownedGroups, joinedGroups: result.joinedGroups }
}

module.exports = {
  findUser,
  findUserWithId,
  getAllUsers,
  createUser,
  login,
  addUserToGroup,
  getUserGroups,
}
