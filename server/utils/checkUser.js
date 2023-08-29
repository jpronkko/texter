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
  console.log('User in group', JSON.stringify(user))
  const userGroups = user.joinedGroups.concat(user.ownedGroups)

  console.log(groupId)
  userGroups.forEach(element => {
    console.log('E', JSON.stringify(element))
  })
  if (userGroups.find(group => group.id === groupId)) {
    return true
  }
  logger.error(`User ${user.id} not in group ${groupId} !`)
  return false
}

const checkUserInTopicGroup = async (user, topicId) => {
  const group = (await Group.findOne({ topics: topicId })).toJSON()
  console.log('------')
  console.log('Topic group. Group, check', group)
  if(!group) {
    throw new Error('No group with such a topic')
  }

  return checkUserInGroup(user, group.id)
}

const checkUserOwnsGroup = (user, groupId) => {
  logger.info('user:', user)
  if (user.ownedGroups.find(group => group.id === groupId))
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