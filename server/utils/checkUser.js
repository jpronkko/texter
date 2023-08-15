const { GraphQLError } = require('graphql')
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
  if (user.joinedGroups.find(group => group.id === groupId) || 
    user.ownedGroups.find(group => group.id === groupId)) {
    return true
  }
  return false
}

const checkUserInOwnedGroup = (user, groupId) => {
  if (user.ownedGroups.includes(groupId))
    return true
  return false
}

module.exports = {
  checkUser,
  checkUserInGroup,
  checkUserInOwnedGroup
}