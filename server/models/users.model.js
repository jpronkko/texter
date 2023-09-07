const logger = require('../utils/logger')

const User = require('./users.mongo')
const { pwCompare, tokenFromUser } = require('../utils/pwtoken')

const findUser = async (username) => {
  logger.info(`Username ${username}`)
  const user = await User.findOne({ username }).populate('groups')
  if (user)
    return user.toJSON()

  logger.error(`No such user found, username ${username}`)
  return null
}

const findUserWithId = async (userId) => {
  const user = await User
    .findById(userId)
    .populate('groups')
  if (user) {
    return user.toJSON()
  }
  return null
}

const getAllUsers = async () => {
  const allUsers = await User.find({})
  return allUsers.map(user => user.toJSON())
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
    .populate('groups')

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

const addUserToGroup = async (userId, groupId, role) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('No such user!')
  }
  logger.info('User in add to group', userId, user)
  user.groups = user.groups.concat({
    groupId,
    role
  })
  const updatedUser = await user.save()
  if (!updatedUser) {
    throw new Error('Saving user failed!')
  }
  console.log('updt user', updatedUser)
  return updatedUser.toJSON()
}

const updateRoleInGroup = async (userId, groupId, role) => {
  console.log('WTFHZSHSHXH\nVitto!1', userId, groupId)
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('No such user!')
  }

  console.log('WTFHZSHSHXH\nVitto!2')
  user.groups = user.groups.map(
    item => item.groupId.toString() === groupId ? { ...item, role } : item
  )

  console.log('WTFHZSHSHXH\nVitto!3', user.groups)
  const savedUser = await user.save()
  //const pobject = await savedUser.populate([{ path: 'groups.groupId' }])
  //console.log('savedUser', JSON.stringify(pobject.groups))
  return savedUser.toJSON()
}

/* Do we need this: */
const getUserJoinedGroups = async (userId) => {
  const user = await User
    .findById(userId)
    .populate('groups')

  if (!user) {
    throw new Error('No such user!')
  }

  return {
    groups: user.groups,
  }
}

module.exports = {
  findUser,
  findUserWithId,
  getAllUsers,
  createUser,
  login,
  addUserToGroup,
  updateRoleInGroup,
  getUserJoinedGroups,
}
