const logger = require('../utils/logger')

const User = require('./users.mongo')
const { pwCompare, tokenFromUser } = require('../utils/pwtoken')

const findUser = async (username) => {
  return await User.findOne({ username })
}

const findUserWithId = async (userId) => {
  const user = await User
    .findById(userId)
    .populate('ownedGroups')
    .populate('joinedGroups')
  if (user) {
    return user.toJSON()
  }
  return undefined
}

const getAllUsers = async () => {
  return await User.find({})
}

const createUser = async (name, username, email, passwordHash) => {
  const user = new User({ name, username, email, passwordHash })
  const result = await user.save()
  if(!result) {
    throw new Error('User save failed!')
  }
  return result.toJSON()
}

const login = async (username, password) => {
  logger.info('Login with username', username, 'password', password)
  const user = await User
    .findOne({ username })
    .populate('ownedGroups')
    .populate('joinedGroups')

  if(!user) {
    throw new Error('No such user')
  }

  const passwordCorrect = await pwCompare(password, user.passwordHash)
  logger.info('PW correct', passwordCorrect)

  if (!passwordCorrect) {
    throw new Error( 'Wrong credentials')
  }

  return {
    token: tokenFromUser(user),
    user: user.toJSON()
  }
}

const addUserToGroup = async (userId, groupId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('No such user!')
  }
  logger.info('User in add to group', userId, user)
  user.joinedGroups = user.joinedGroups.concat(groupId)
  const updatedUser = (await user.save())
    .populate('joinedGroups')
  return (await updatedUser).toJSON()
}

/* Do we need this: */
const getUserGroups = async (userId) => {
  const user = await User
    .findById(userId)
    .populate('joinedGroups')
    .populate('ownedGroups')

  if (!user) {
    throw new Error('No such user!')
  }
  const user2 = user.toJSON()

  return {
    ownedGroups: user2.ownedGroups,
    joinedGroups: user2.joinedGroups
  }
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
