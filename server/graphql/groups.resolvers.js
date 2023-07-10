/*const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()*/
const groupsModel = require('../models/groups.model')
const logger = require('../utils/logger')
const { findUserWithId } = require('../models/users.model')
const { GraphQLError } = require('graphql')

module.exports = {
  Query: {
    findGroups: async (root, args) =>
      await groupsModel.findUserGroups(args.ownerId),
    findGroup: async (root, args) => {
      await groupsModel.findGroup(args.ownerId, args.name)
    }
  },
  Mutation: {
    createGroup: async (root, args) => {
      logger.info('Create Group', args)
      const { input: { name, ownerId } } = args

      const user = await findUserWithId(ownerId)
      if(!user) {
        throw new GraphQLError('Creating group failed!', {
          extensions: {
            code: 'GROUP_CREATE_FAILED',
            invalidArgs: ownerId
          }
        })
      }
      const newGroup = await groupsModel.createGroup(
        ownerId, name
      )
      //pubsub.publish('USER_ADDED', { userAdded: newGroup })
      return newGroup
    }
  },
  /*Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }*/
}