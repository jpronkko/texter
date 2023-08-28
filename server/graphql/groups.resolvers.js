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

      if(!checkUserInGroup(currentUser, args.groupId)) {
        throw new GraphQLError('Not authorized!')
      }
      const messages = await groupsModel.getTopics(args.groupId)
      return messages
    }
  },
  Mutation: {
    createGroup: async (root, args, { currentUser }) => {
      logger.info('Creating a group', args)

      checkUser(currentUser, 'Creating a group failed!')

      const { name } = args

      const newGroup = await groupsModel.createGroup(
        currentUser,
        name
      )
      return {
        id: newGroup.id,
        name: newGroup.name,
        ownerId: newGroup.ownerId,
      }
    },
  },
}