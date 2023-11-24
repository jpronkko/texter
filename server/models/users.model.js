const logger = require('../utils/logger')

const User = require('./users.mongo')
const { getHash, pwCompare, tokenFromUser } = require('../utils/pwtoken')

const findUserWithId = async (userId) => {
  const user = await User.findById(userId)
  if (user) {
    return user.toJSON()
  }

  return null
}

const findUserByUsername = async (username) => {
  const user = await User.findOne({ username })
  if (user) {
    return user.toJSON()
  }

  return null
}

const findUserWithGroups = async (username) => {
  const user = await User.findOne({ username }).populate({
    path: 'joinedGroups',
    model: 'JoinedGroup',
    populate: {
      path: 'group',
      model: 'Group',
    },
  })

  if (!user) return null
  const jsonedUser = user.toJSON()
  jsonedUser.joinedGroups = jsonedUser.joinedGroups.map((item) => ({
    groupId: item.group.id,
    groupName: item.group.name,
    role: item.role,
  }))
  return jsonedUser
}

const getAllUsers = async () => {
  const allUsers = await User.find({}).populate({
    path: 'joinedGroups',
    model: 'JoinedGroup',
    populate: {
      path: 'group',
      model: 'Group',
      select: '_id, name',
    },
  })

  const allUsersJSON = allUsers.map((user) => user.toJSON())
  console.log('all users I', allUsersJSON)
  allUsersJSON.forEach((user) => {
    user.joinedGroups = user.joinedGroups.map((item) => ({
      groupId: item.group.id,
      groupName: item.group.name,
      role: item.role,
    }))
  })
  return allUsersJSON
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

const compUserPWWithHash = async (userId, password) => {
  const user = await User.findById(userId)
  if (!user) {
    return false
  }
  const passwordCorrect = await pwCompare(password, user.passwordHash)
  logger.info('Is password correct: ', passwordCorrect)

  return passwordCorrect
}

const changePassword = async (userId, newPassword) => {
  logger.info('Change password for user', userId)
  const user = await User.findById(userId)
  if (!user) {
    logger.error(`User with id: ${userId} not found!`)
    throw new Error('No such user!')
  }

  const passwordHash = await getHash(newPassword)
  user.passwordHash = passwordHash

  try {
    const updatedUser = await user.save()
    if (!updatedUser) {
      logger.error('User save failed in changePassword')
      throw new Error('Saving user failed!')
    }
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
    }
  } catch (error) {
    throw new Error('Saving user failed!')
  }
}

const changeEmail = async (userId, newEmail) => {
  const user = await User.findById(userId)
  if (!user) {
    logger.error(`User with id: ${userId} not found!`)
    throw new Error('No such user!')
  }
  user.email = newEmail
  try {
    const updatedUser = await user.save()
    if (!updatedUser) {
      logger.error('User save failed in changePassword')
      throw new Error('Saving user failed!')
    }
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
    }
  } catch (error) {
    throw new Error('Saving user failed!')
  }
}

const addUserToGroup = async (userId, groupId, role) => {
  const user = await User.findById(userId)
  if (!user) {
    logger.error(`User with id: ${userId} not found!`)
    throw new Error('No such user!')
  }

  const exists = user.joinedGroups.find(
    (item) => item.group.toString() === groupId
  )
  if (exists) {
    throw new Error('User exists in group already')
  }
  user.joinedGroups = user.joinedGroups.concat({
    group: groupId,
    role,
  })

  try {
    const updatedUser = await user.save()
    if (!updatedUser) {
      logger.error('User save failed in addUserToGroup')
      throw new Error('Saving user failed!')
    }

    return { user: updatedUser.id, group: groupId, role }
  } catch (error) {
    throw new Error('Saving user failed!')
  }
}

const removeUserFromGroup = async (userId, groupId) => {
  const user = await User.findById(userId)
  if (!user) {
    logger.error(`User with id: ${userId} not found!`)
    throw new Error('No such user!')
  }

  user.joinedGroups = user.joinedGroups.filter(
    (joinedGroup) => joinedGroup.group.toString() !== groupId
  )

  try {
    const updatedUser = await user.save()
    if (!updatedUser) {
      logger.error('User save failed in addUserToGroup')
      throw new Error('Saving user failed!')
    }

    const jsonedUser = updatedUser.toJSON()
    const retVal = jsonedUser.joinedGroups.map((item) => ({
      groupId: item.group.id,
      groupName: item.group.name,
      description: item.group.description,
      role: item.role,
    }))

    console.log('ret from model', retVal)
    return retVal
  } catch (error) {
    throw new Error('Saving user failed!')
  }
}

const updateRoleInGroup = async (userId, groupId, role) => {
  const user = await User.findById(userId)

  if (!user) {
    logger.error(`No such user found: ${userId}`)
    throw new Error('No such user!')
  }

  user.joinedGroups = user.joinedGroups.map((item) =>
    item.group.toString() === groupId ? { ...item, role } : item
  )

  await user.save()
  return { user: userId, group: groupId, role }
}

const getUserJoinedGroups = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'joinedGroups',
    model: 'JoinedGroup',
    populate: {
      path: 'group',
      model: 'Group',
      select: 'name description id',
    },
  })

  console.log('-------------------')
  console.log('getUserJoinedGroups user:', JSON.stringify(user, null, 4))
  console.log('-------------------')
  if (!user) {
    logger.error(`No user with ${userId} found!`)
    throw new Error('No such user!')
  }

  const jsonedUser = user.toJSON()
  console.log(
    'getUserJoinedGroups jsonedUser',
    jsonedUser,
    'joined groups',
    jsonedUser.joinedGroups
  )

  console.log('foreachitys')
  jsonedUser.joinedGroups.forEach((item) => {
    console.log('item', item)
  })

  const retVal = jsonedUser.joinedGroups.map((item) => ({
    groupId: item.group.id,
    groupName: item.group.name,
    description: item.group.description,
    role: item.role,
  }))

  console.log('retVal', retVal)
  return retVal
  // if (jsonedUser.joinedGroups) {
  //   return groupsToJoinedGroups(jsonedUser.joinedGroups)
  // }
  // return []
  // //return groupsToJoinedGroups(jsonedUser.groups)
}

module.exports = {
  findUserByUsername,
  findUserWithId,
  findUserWithGroups,
  getAllUsers,
  createUser,
  login,
  compUserPWWithHash,
  changePassword,
  changeEmail,
  addUserToGroup,
  removeUserFromGroup,
  updateRoleInGroup,
  getUserJoinedGroups,
}
