const logger = require('../utils/logger')

const Group = require('./groups.mongo')
const User = require('./users.mongo')

const findUserGroups = async (ownerId) => {
  return await Group.find({ ownerId }).select({ 'name': 1, '_id': 1 })
}

const findGroup = async (groupId) => {
  return await Group.findOne({ _id: groupId })
}
const findGroupWithName = async (ownerId, groupName) => {
  return await Group.findOne({ ownerId, name: groupName })
}

// Hash check...
const createGroup = async (ownerId, name) => {
  logger.info('createGroup: ', ownerId, name)
  const existingGroup = await findGroupWithName(ownerId, name)
  logger.info('Create group existing group', existingGroup)
  if(existingGroup) {
    throw new Error(`User already has group with name ${name}.`)
  }

  const user = await User.findById(ownerId)
  if(!user) {
    throw new Error('No such user found!')
  }

  const group = new Group({ owner: ownerId, name })
  const savedGroup = await group.save()
  logger.info('user: ', user.ownedGroups)
  user.ownedGroups = user.ownedGroups.concat(savedGroup._id)
  await user.save()
  return savedGroup
}

module.exports = {
  findUserGroups,
  findGroup,
  findGroupWithName,
  createGroup,
}
