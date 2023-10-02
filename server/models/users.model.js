const logger = require('../utils/logger')

const User = require('./users.mongo')
const { pwCompare, tokenFromUser } = require('../utils/pwtoken')

const findUser = async (username) => {
  //const user = await User.findOne({ username }).populate('groups')
  const user = await User.findOne({ username })
  if (user) return user.toJSON()

  return null
}

const findUserWithId = async (userId) => {
  console.log('finding user with id', userId)
  const user = await User.findById(userId)
  // const user = await User.findById(userId).populate({
  //   path: 'groups',
  //   model: 'JoinedGroup',
  //   populate: {
  //     path: 'group',
  //     model: 'Group',
  //   },
  // })

  if (user) {
    return user.toJSON()
  }
  return null
}

const getAllUsers = async () => {
  const allUsers = await User.find({})
  return allUsers.map((user) => user.toJSON())
}

const createUser = async (name, username, email, passwordHash) => {
  const user = new User({ name, username, email, passwordHash })
  const savedUser = (await user.save()).toJSON()
  if (!savedUser) {
    throw new Error('User save failed!')
  }
  return {
    userId: savedUser.id,
    username: savedUser.username,
    email: savedUser.email,
    name: savedUser.name,
  }
}

const login = async (username, password) => {
  logger.info('Login with username', username, 'password', password)
  const user = await User.findOne({ username })
  /* .populate(
      {
        path: 'groups',
        model: 'JoinedGroup',
        populate: {
          path: 'group',
          model: 'Group'
        }
      }
    )*/

  if (!user) {
    throw new Error('No such user')
  }

  console.log('User', user, 'groups')

  const passwordCorrect = await pwCompare(password, user.passwordHash)
  logger.info('Login password correct', passwordCorrect)

  if (!passwordCorrect) {
    throw new Error('Wrong credentials')
  }

  const userJSON = user.toJSON()
  return {
    token: tokenFromUser(userJSON),
    userId: userJSON.id,
    username: userJSON.username,
    email: userJSON.email,
    name: userJSON.name,
  }
}

const addUserToGroup = async (userId, groupId, role) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('No such user!')
  }

  user.groups = user.groups.concat({
    group: groupId,
    role,
  })

  // TODO!
  try {
    const updatedUser = await user.save()
    if (!updatedUser) {
      logger.error('User save failed in addUserToGroup')
      throw new Error('Saving user failed!')
    }
    return updatedUser.toJSON()
  } catch (error) {
    throw new Error('Saving user failed2!')
  }
}

const updateRoleInGroup = async (userId, groupId, role) => {
  console.log('updating user role', userId, groupId, role)
  const user = await User.findById(userId).populate({
    path: 'groups',
    model: 'JoinedGroup',
    populate: {
      path: 'group',
      model: 'Group',
    },
  })

  if (!user) {
    logger.error(`No such user found: ${userId}`)
    throw new Error('No such user!')
  }

  user.groups = user.groups.map((item) =>
    item.group.id === groupId ? { ...item, role } : item
  )

  const savedUser = await user.save()
  return savedUser.toJSON()
}

/* Do we need this: */
const getUserJoinedGroups = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'groups',
    model: 'JoinedGroup',
    populate: {
      path: 'group',
      model: 'Group',
    },
  })

  if (!user) {
    throw new Error('No such user!')
  }

  return user.toJSON().groups
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
