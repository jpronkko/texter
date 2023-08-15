const logger = require('../utils/logger')

const Group = require('./groups.mongo')

const getAllGroups = async () => {
  logger.info('Finding all groups')
  return await Group.find({})
}

const findGroup = async (groupId) => {
  return await Group.findOne({ _id: groupId })
}

const findGroupWithName = async (ownerId, groupName) => {
  return await Group.findOne({ ownerId, name: groupName })
}

const createGroup = async (user, name) => {
  logger.info('createGroup: ', user.id, name)
  const existingGroup = await findGroupWithName(user.id, name)
  logger.info('Create group existing group', existingGroup)
  if(existingGroup) {
    throw new Error(`User already has group with name ${name}.`)
  }

  const group = new Group({ name })
  const savedGroup = await group.save()
  user.ownedGroups = user.ownedGroups.concat(savedGroup._id)
  logger.info('user: ', user.ownedGroups)
  await user.save()
  return savedGroup
}

module.exports = {
  getAllGroups,
  findGroup,
  findGroupWithName,
  createGroup,
}
