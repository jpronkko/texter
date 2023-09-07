const Group = require('./groups.mongo')
const User = require('./users.mongo')

const logger = require('../utils/logger')

const getAllGroups = async () => {
  logger.info('Finding all groups')
  const groups = await Group.find({})
  if(groups)
    return groups.map(group => group.toJSON())
  return null
}

const findGroup = async (groupId) => {
  const group = await Group.findById(groupId)
  if(group) {
    return group.toJSON()
  }
  return null
}

const findGroupWithName = async (ownerId, groupName) => {
  const group = await Group.findOne({ ownerId, name: groupName })
  if (group)
    return group.toJSON()
  return null
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
  if(!savedGroup) {
    throw new Error('Group save failed!')
  }
  console.log('savedGroup', savedGroup)
  const userToUpdate = await User.findById(user.id)
  userToUpdate.groups = userToUpdate.groups.concat({
    groupId: savedGroup._id,
    role: 'OWNER'
  })
  await userToUpdate.save()
  /*const savedUser = await User.findById(user.id)
  console.log('Groups', savedUser.ownedGroups)*/
  return savedGroup.toJSON()
}

const getTopics = async (groupId) => {
  console.log('getTopics groupId', groupId)
  const topicsData = await Group.findById(groupId)
    .select({ 'topics': 1, '_id': 0 })
    .populate('topics')
  if (topicsData) {
    console.log('getTopics', topicsData)
    return topicsData.map(topic => topic.toJSON())
  }
  return null
}

module.exports = {
  getAllGroups,
  findGroup,
  findGroupWithName,
  createGroup,
  getTopics,
}
