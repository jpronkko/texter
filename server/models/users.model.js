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
  console.log('finding user with id', userId, typeof userId)
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

  console.error('useri', user)
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

  try {
    const updatedUser = await user.save()
    if (!updatedUser) {
      logger.error('User save failed in addUserToGroup')
      throw new Error('Saving user failed!')
    }
    const jsonedUserGroups = user.groups.map((group) => group.toJSON())
    return jsonedUserGroups
  } catch (error) {
    throw new Error('Saving user failed!')
  }
}

const updateRoleInGroup = async (userId, groupId, role) => {
  console.log('2!------------------------------------!')
  console.log(`userId: ${userId} groupId ${groupId} role ${role}.`)
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
  return savedUser.toJSON().groups
}

const getUserJoinedGroups = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'groups',
    model: 'JoinedGroup',
    populate: {
      path: 'group',
      model: 'Group',
      select: '_id, name',
    },
  })

  console.log('wut: userGroups for user joined groups', user)
  if (!user) {
    logger.error(`No user with ${userId} found!`)
    throw new Error('No such user!')
  }

  const jsonedUserGroups = user.groups.map((group) => group.toJSON())
  console.log(
    'jsoned userGroups for user joined groups',
    JSON.stringify(jsonedUserGroups)
  )

  return jsonedUserGroups
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
