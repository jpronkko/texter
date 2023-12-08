const { GraphQLError } = require('graphql')
const Group = require('../models/groups.mongo')
const logger = require('../utils/logger')

const checkUser = (currentUser, errorMessage) => {
  if (!currentUser) {
    logger.error('No user in header!')
    throw new GraphQLError(errorMessage, {
      extensions: { code: 'BAD_USER_INPUT', invalidArgs: currentUser },
    })
  }
}

const checkUserInGroup = (user, groupId) => {
  const userGroups = user.joinedGroups

  //console.error('-----------------')
  //console.log('Check user in group, userGroups', user, userGroups)
  if (userGroups.find((item) => item.group.toString() === groupId)) {
    return true
  }
  logger.error(`User ${user} not in group ${groupId}!`)
  logger.error(userGroups)
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
