const Group = require('../models/groups.mongo')
const logger = require('../utils/logger')

const checkUser = (currentUser, errorMessage) => {
  if (!currentUser) {
    logger.error('Not authorized, no user in header!')
    throw new Error(errorMessage)
  }
}

const checkUserInGroup = (user, groupId) => {
  const userGroups = user.joinedGroups

  if (userGroups.find((item) => item.group.toString() === groupId)) {
    return true
  }
  logger.error(`User ${JSON.stringify(user, null, 4)} not in group ${groupId}!`)
  return false
}

const checkUserInTopicGroup = async (user, topicId) => {
  const group = await Group.findOne({ topics: topicId })
  if (!group) return false
  return checkUserInGroup(user, group._id)
}

const checkUserOwnsGroup = (user, groupId) => {
  const joinedGroup = user.joinedGroups.find(
    (item) => item.group.toString() === groupId
  )
  if (joinedGroup && joinedGroup.role === 'OWNER') return true

  logger.error(
    `User ${user.username} does not own group ${groupId}!`,
    joinedGroup
  )
  return false
}

const checkUserOwnsOrIsAdminInGroup = (user, groupId) => {
  const joinedGroup = user.joinedGroups.find(
    (item) => item.group.toString() === groupId
  )
  if (
    joinedGroup &&
    (joinedGroup.role === 'OWNER' || joinedGroup.role === 'ADMIN')
  )
    return true

  logger.error(
    `User ${user.username} does not own group ${groupId}!`,
    joinedGroup
  )
  return false
}

module.exports = {
  checkUser,
  checkUserInGroup,
  checkUserInTopicGroup,
  checkUserOwnsGroup,
  checkUserOwnsOrIsAdminInGroup,
}
