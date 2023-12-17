const Invitation = require('./invitations.mongo')
const User = require('./users.mongo')
const { getHash, pwCompare, tokenFromUser } = require('../utils/pwtoken')
const logger = require('../utils/logger')
const { Types } = require('mongoose')

const findUserWithId = async (userId) => {
  const user = await User.findById(userId)

  if (user) {
    const jsonedUser = user.toJSON()
    jsonedUser.joinedGroups = user.joinedGroups.map((item) => ({
      role: item.role,
      group: item.group.toString(),
    }))
    return jsonedUser
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
  const existingUser = await findUserByUsername(username)
  if (existingUser) {
    throw new Error('Username taken')
  }
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
  const user = await User.findOne({ username })

  if (!user) {
    throw new Error('No such user')
  }

  const passwordCorrect = await pwCompare(password, user.passwordHash)

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
  return passwordCorrect
}

const changePassword = async (userId, newPassword) => {
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

  const updatedUser = await user.save()
  if (!updatedUser) {
    logger.error('User save to db failed in addUserToGroup', updatedUser)
    throw new Error('Saving user failed!')
  }

  return { user: updatedUser.id, group: groupId, role }
}

const removeUserFromGroup = async (userId, groupId) => {
  const user = await User.findById(userId).populate({
    path: 'joinedGroups',
    model: 'JoinedGroup',
    populate: {
      path: 'group',
      model: 'Group',
      select: 'id name description',
    },
  })

  if (!user) {
    logger.error(`User with id: ${userId} not found!`)
    throw new Error('No such user!')
  }

  const group = user.joinedGroups.find(
    (item) => item.group._id.toString() === groupId
  )
  if (!group) {
    logger.error(`Group with id: ${groupId} not found!`)
    throw new Error(`No such group ${groupId} in joined groups!`)
  }

  user.joinedGroups = user.joinedGroups.filter(
    (joinedGroup) => joinedGroup.group._id.toString() !== groupId
  )

  const updatedUser = await user.save()
  if (!updatedUser) {
    logger.error('User save failed in addUserToGroup')
    throw new Error('Saving user failed!')
  }

  const jsonedUser = updatedUser.toJSON()
  const joinedGroups = jsonedUser.joinedGroups.map((item) => ({
    groupId: item.group.id,
    groupName: item.group.name,
    description: item.group.description,
    role: item.role,
  }))

  return {
    joinedGroups,
    userGroupRole: { user: userId, group: groupId, role: group.role },
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

  if (!user) {
    logger.error(`No user with ${userId} found!`)
    throw new Error('No such user!')
  }

  const jsonedUser = user.toJSON()
  const joinedGroups = jsonedUser.joinedGroups.map((item) => ({
    groupId: item.group.id,
    groupName: item.group.name,
    description: item.group.description,
    role: item.role,
  }))

  return joinedGroups
}

const getUsersNotInGroup = async (groupId) => {
  // gather users that are not in the group and have no pending invitation
  // to the group
  const groupObjectId = new Types.ObjectId(groupId)
  const hasInvitationToGroup = await Invitation.find(
    { $and: [{ groupId: groupObjectId }, { status: 'PENDING' }] },
    'toUserId'
  )

  const usersNotInGroup = await User.find({
    $and: [
      { 'joinedGroups.group': { $ne: groupObjectId } },
      { _id: { $nin: hasInvitationToGroup.map((item) => item.toUserId) } },
    ],
  })

  return usersNotInGroup.map((user) => ({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    name: user.name,
  }))
}

module.exports = {
  findUserByUsername,
  findUserWithId,
  findUserWithGroups,
  getAllUsers,
  getUsersNotInGroup,
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
