/*const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()*/
const groupsModel = require('../models/groups.model')
const logger = require('../utils/logger')

module.exports = {
  Query: {
    findUserGroups: async (root, args) =>
      await groupsModel.findUserGroups(args.userId)
  },
  Mutation: {
    createGroup: async (root, args) => {
      logger.info('Create Group', args)
      const { input: { name, ownerId } } = args

      const newGroup = await groupsModel.createGroup(
        name, ownerId
      )
      //pubsub.publish('USER_ADDED', { userAdded: newGroup })
      return newGroup
    }
  },
  /*Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }*/
}