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

      const { name } = args
      const newGroup = await groupsModel.createGroup(currentUser, name)

      return newGroup

      // return {
      //   id: newGroup.id,
      //   name: newGroup.name,
      //   ownerId: newGroup.ownerId,
      // }
    },
  },
}
