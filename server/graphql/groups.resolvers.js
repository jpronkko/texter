const groupsModel = require('../models/groups.model')

const logger = require('../utils/logger')
const { checkUser, checkUserInGroup } = require('../utils/checkUser')
const { GraphQLError } = require('graphql')

module.exports = {
  Query: {
    allGroups: async () => {
      return await groupsModel.getAllGroups()
    },
    getTopics: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Not authorized!')

      if (!checkUserInGroup(currentUser, args.groupId)) {
        throw new GraphQLError('Not authorized for group!')
      }

      return await groupsModel.getTopics(args.groupId)
    },
    getGroupMembers: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Not authorized!')

      if (!checkUserInGroup(currentUser, args.groupId)) {
        throw new GraphQLError('Not authorized for group!')
      }

      return await groupsModel.getGroupMembers(args.groupId)
    },
  },
  Mutation: {
    createGroup: async (root, args, { currentUser }) => {
      logger.info('Creating group', args.name)
      checkUser(currentUser, 'Creating a group failed!')

      const { name, description } = args
      const newGroup = await groupsModel.createGroup(
        currentUser,
        name,
        description
      )

      return newGroup

      // return {
      //   id: newGroup.id,
      //   name: newGroup.name,
      //   ownerId: newGroup.ownerId,
      // }
    },
    modifyGroup: async (root, args, { currentUser }) => {
      logger.info('Modifying group', args.name)
      checkUser(currentUser, 'Modifying a group failed!')

      if (!checkUserInGroup(currentUser, args.groupId)) {
        throw new GraphQLError('Not authorized for group!')
      }

      const { groupId, name, description } = args

      const modifiedGroup = await groupsModel.modifyGroup(
        groupId,
        name,
        description
      )

      return modifiedGroup
    },
  },
}
