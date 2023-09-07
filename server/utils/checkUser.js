const { GraphQLError } = require('graphql')
const Group = require('../models/groups.mongo')
const logger = require('../utils/logger')

const checkUser =  (currentUser, errorMessage) => {
  if (!currentUser) {
    logger.error('No user in header')
    throw new GraphQLError(errorMessage, {
      extensions: { code: 'BAD_USER_INPUT' }
    })
  }
}

const checkUserInGroup = (user, groupId) => {
  const userGroups = user.joinedGroups.concat(user.ownedGroups)

  if (userGroups.find(group => group.id === groupId)) {
    return true
  }
  logger.error(`User ${user.id} not in group ${groupId} !`)
  return false
}

const checkUserInTopicGroup = async (user, topicId) => {
  try {
    const group = await Group.findOne({ topics: topicId }).toJSON()
    return checkUserInGroup(user, group.id)
  //if(!group) {
  //  throw new Error('No group with such a topic')
  } catch(error) {
    return null
  }
}

const checkUserOwnsGroup = (user, groupId) => {
  const joinedGroup = user.groups.find(item => item.groupId === groupId)
  if (joinedGroup && joinedGroup.role === 'OWNER')
    return true

  logger.error(`User ${user.id} does not own group ${groupId}!`)
  return false
}

module.exports = {
  checkUser,
  checkUserInGroup,
  checkUserInTopicGroup,
  checkUserOwnsGroup
}