const logger = require('../utils/logger')

const User = require('./users.mongo')
const { pwCompare, tokenFromUser } = require('../utils/pwtoken')

const findUser = async (username) => {
  const user = await User.findOne({ username }).populate('groups')
  if (user)
    return user.toJSON()

  return null
}

const findUserWithId = async (userId) => {
  const user = await User
    .findById(userId)
    .populate(
      {
        path: 'groups',
        model: 'JoinedGroup',
        populate: {
          path: 'group',
          model: 'Group'
        }
      }
    )

  if (user) {
    console.log('jsoned userxx', user.toJSON())
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
    .populate(
      {
        path: 'groups',
        model: 'JoinedGroup',
        populate: {
          path: 'group',
          model: 'Group'
        }
      }
    )

  if(!user) {
    throw new Error('No such user')
  }

  console.log('User', user, 'groups')
  console.log('groups', user.groups[0], typeof user.groups[0])
  console.log('jsoned', JSON.stringify(user.toJSON().groups[0]))

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
  console.log('3.5')
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('No such user!')
  }

  console.log('3.6')
  user.groups = user.groups.concat({
    group: groupId,
    role
  })

  console.log('fd', user)
  const updatedUser = await user.save()
  if (!updatedUser) {
    logger.error('User save failed in addUserToGroup')
    throw new Error('Saving user failed!')
  }
  return updatedUser.toJSON()
}

const updateRoleInGroup = async (userId, groupId, role) => {
  console.log('updating user role', userId, groupId, role)
  const user = await User.findById(userId)
    .populate(
      {
        path: 'groups',
        model: 'JoinedGroup',
        populate: {
          path: 'group',
          model: 'Group'
        }
      }
    )

  if (!user) {
    logger.error(`No such user found: ${userId}`)
    throw new Error('No such user!')
  }

  user.groups = user.groups.map(
    item => item.group.id === groupId ? { ...item, role } : item
  )

  const savedUser = await user.save()
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
