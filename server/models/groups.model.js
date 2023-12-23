const Group = require('./groups.mongo')
const topicsModel = require('./topics.model')
const User = require('./users.mongo')
const mongoose = require('mongoose')

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

const findOrCreateCommonGroup = async () => {
  const commonGroup = await Group.findOne({ name: 'Common' })
  if (commonGroup) return commonGroup.toJSON()

  const group = new Group({
    name: 'Common',
    description: 'Common group for all users',
    ownerId: '000000000000000000000000',
  })
  const savedGroup = await group.save()
  if (!savedGroup) {
    throw new Error('group save failed')
  }

  const topic = await topicsModel.createTopic(savedGroup._id, 'General')
  if (!topic) {
    throw new Error('topic save failed')
  }
  return savedGroup.toJSON()
}

const createGroup = async (user, name, description) => {
  const existingGroup = await findGroupWithName(user.id, name)
  if (existingGroup) {
    throw new Error(`user already has group with name ${name}`)
  }

  const group = new Group({ name, description, ownerId: user.id })
  const savedGroup = await group.save()
  if (!savedGroup) {
    throw new Error('group save failed')
  }

  const userToUpdate = await User.findById(user.id)
  userToUpdate.joinedGroups = userToUpdate.joinedGroups.concat({
    group: savedGroup._id,
    description: savedGroup.description,
    role: 'OWNER',
  })

  try {
    await userToUpdate.save()
  } catch (error) {
    console.error(error)
  }

  return savedGroup.toJSON()
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

const getGroupMembers = async (groupId) => {
  const user = await User.find({
    'joinedGroups.group': new mongoose.Types.ObjectId(groupId),
  })

  const usersData = user.map((user) => {
    const group = user.joinedGroups.find(
      (joinedGroup) => joinedGroup.group.toString() === groupId
    )
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      role: group.role,
    }
  })

  if (usersData) {
    return usersData
  }
  return null
}

const modifyGroup = async (groupId, name, description) => {
  const group = await Group.findById(groupId)
  if (!group) {
    throw new Error('no such group')
  }
  group.name = name
  group.description = description
  const savedGroup = await group.save()
  if (!savedGroup) {
    throw new Error('group save failed')
  }
  return savedGroup.toJSON()
}

module.exports = {
  findGroup,
  findGroupWithName,
  findOrCreateCommonGroup,
  createGroup,
  getTopics,
  getGroupMembers,
  modifyGroup,
}
