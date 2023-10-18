const { GraphQLError } = require('graphql')
const Group = require('../models/groups.mongo')
const logger = require('../utils/logger')

const checkUser = (currentUser, errorMessage) => {
  if (!currentUser) {
    logger.error('No user in header!')
    throw new GraphQLError(errorMessage, {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }
}

const checkUserInGroup = (user, groupId) => {
  const userGroups = user.groups
  if (userGroups.find((item) => item.group === groupId)) {
    return true
  }
  logger.error(`User ${user} not in group ${groupId}!`)
  logger.error(userGroups)
  return false
}

const checkUserInTopicGroup = async (user, topicId) => {
  try {
    const group = await Group.findOne({ topics: topicId }).toJSON()
    return checkUserInGroup(user, group.id)
    //if(!group) {
    //  throw new Error('No group with such a topic')
  } catch (error) {
    return null
  }
}

const checkUserOwnsGroup = (user, groupId) => {
  console.log(
    'check user owns group',
    JSON.stringify(user),
    'group id',
    groupId
  )
  //const joinedGroup = User.findById(user.id).
  const joinedGroup = user.groups.find((item) => item.group === groupId)
  if (joinedGroup && joinedGroup.role === 'OWNER') return true

  logger.error(`User ${user} does not own group ${groupId}!`, joinedGroup)
  return false
}

module.exports = {
  checkUser,
  checkUserInGroup,
  checkUserInTopicGroup,
  checkUserOwnsGroup,
}
