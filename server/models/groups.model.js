const Group = require('./groups.mongo')
const User = require('./users.mongo')

const getAllGroups = async () => {
  const groups = await Group.find({})
  if (groups) return groups.map((group) => group.toJSON())
  return null
}

const findGroup = async (groupId) => {
  const group = await Group.findById(groupId)
  if (group) {
    return group.toJSON()
  }
  return null
}

const findGroupWithName = async (ownerId, groupName) => {
  const group = await Group.findOne({ ownerId, name: groupName })
  if (group) return group.toJSON()
  return null
}

const createGroup = async (user, name) => {
  const existingGroup = await findGroupWithName(user.id, name)
  if (existingGroup) {
    throw new Error(`User already has group with name ${name}.`)
  }

  const group = new Group({ name, ownerId: user.id })
  const savedGroup = await group.save()
  if (!savedGroup) {
    throw new Error('Group save failed!')
  }

  const userToUpdate = await User.findById(user.id)
  userToUpdate.joinedGroups = userToUpdate.joinedGroups.concat({
    group: savedGroup._id,
    role: 'OWNER',
  })

  try {
    await userToUpdate.save()
  } catch (error) {
    console.error(error)
  }

  /*const savedWithIds = savedGroup.toJSON()
  console.log('Create Group Saved with ids', savedWithIds)
  const groupInfo = {
    id: savedWithIds.id,
    name: savedWithIds.name,
  }*/

  const groupInfo = {
    id: savedGroup._id,
    name: savedGroup.name,
    ownerId: savedGroup.ownerId,
  }
  console.log('Created Group', groupInfo)
  return savedGroup.toJSON()
  //return groupInfo
}

const getTopics = async (groupId) => {
  const topicsData = await Group.findById(groupId)
    .select({ topics: 1, _id: 0 })
    .populate('topics')
  if (topicsData) {
    return topicsData.topics.map((topic) => topic.toJSON())
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
