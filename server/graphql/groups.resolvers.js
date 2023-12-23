const groupsModel = require('../models/groups.model')

const logger = require('../utils/logger')
const { checkUser, checkUserInGroup } = require('../utils/checkUser')
const { GraphQLError } = require('graphql')

module.exports = {
  Query: {
    getTopics: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        if (!checkUserInGroup(currentUser, args.groupId)) {
          throw new Error('not authorized for group')
        }

        return await groupsModel.getTopics(args.groupId)
      } catch (error) {
        logger.error('Getting topics failed', error)
        throw new GraphQLError(error.message)
      }
    },
    getGroupMembers: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        if (!checkUserInGroup(currentUser, args.groupId)) {
          throw new Error('not authorized for group')
        }
        return await groupsModel.getGroupMembers(args.groupId)
      } catch (error) {
        logger.error('Getting group members failed', error)
        throw new GraphQLError(error.message)
      }
    },
  },
  Mutation: {
    createGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        const { name, description } = args
        const newGroup = await groupsModel.createGroup(
          currentUser,
          name,
          description
        )

        return newGroup
      } catch (error) {
        logger.error('Creating a group failed', error)
        throw new GraphQLError(error.message)
      }
    },
    modifyGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Modifying a group failed!')

        if (!checkUserInGroup(currentUser, args.groupId)) {
          throw new Error('not authorized')
        }

        const { groupId, name, description } = args

        const modifiedGroup = await groupsModel.modifyGroup(
          groupId,
          name,
          description
        )

        return modifiedGroup
      } catch (error) {
        logger.error('Modifying a group failed', error)
        throw new GraphQLError(error.message)
      }
    },
  },
}
