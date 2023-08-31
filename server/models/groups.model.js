const Group = require('./groups.mongo')
const User = require('./users.mongo')

const logger = require('../utils/logger')

const getAllGroups = async () => {
  logger.info('Finding all groups')
  return await Group.find({})
}

const findGroup = async (groupId) => {
  return await Group.findById(groupId)
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

  const group = new Group({ name, ownerId: user.id })
  const savedGroup = await group.save()

  const userToUpdate = await User.findById(user.id)
  userToUpdate.ownedGroups = userToUpdate.ownedGroups.concat(savedGroup._id)
  await userToUpdate.save()
  /*const savedUser = await User.findById(user.id)
  console.log('Groups', savedUser.ownedGroups)*/
  return savedGroup
}

const getTopics = async (groupId) => {
  console.log('getTopics groupId', groupId)
  const topicsRet = await Group.findById(groupId)
    .select({ 'topics': 1, '_id': 0 })
    .populate('topics')
  console.log('getTopics', topicsRet)
  return topicsRet.topics
}

module.exports = {
  getAllGroups,
  findGroup,
  findGroupWithName,
  createGroup,
  getTopics,
}
