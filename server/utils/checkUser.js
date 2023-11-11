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
  const userGroups = user.joinedGroups

  console.error('-----------------')
  console.log('Check user in group, userGroups', user, userGroups)
  if (userGroups.find((item) => item.group.toString() === groupId)) {
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
    'check user owns group user:',
    JSON.stringify(user, null, 4),
    ' group',
    groupId
  )
  //const joinedGroup = User.findById(user.id).
  user.joinedGroups.forEach((element) => {
    console.log('element', element)
  })

  console.log('trying to find group', groupId, typeof groupId)

  const joinedGroup = user.joinedGroups.find(
    (item) => item.group,
    toString() === groupId
  )
  if (joinedGroup && joinedGroup.role === 'OWNER') return true

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
}
