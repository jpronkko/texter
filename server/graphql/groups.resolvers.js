/*const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()*/
const groupsModel = require('../models/groups.model')
const logger = require('../utils/logger')
const { findUserWithId } = require('../models/users.model')
const { GraphQLError } = require('graphql')

module.exports = {
  Query: {
    findGroups: async (root, args, { currentUser }) =>
      //await groupsModel.findUserGroups(args.ownerId),
      await groupsModel.findUserGroups(currentUser.id),
    findGroup: async (root, args) => {
      await groupsModel.findGroup(args.ownerId, args.name)
    }
  },
  Mutation: {
    createGroup: async (root, args, { currentUser }) => {
      logger.info('Create Group', args)

      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const { input: { name  } } = args

      const user = await findUserWithId(currentUser.id)
      if(!user) {
        throw new GraphQLError('Creating group failed!', {
          extensions: {
            code: 'GROUP_CREATE_FAILED',
            invalidArgs: currentUser.id
          }
        })
      }
      const newGroup = await groupsModel.createGroup(
        currentUser.id, name
      )
      //pubsub.publish('USER_ADDED', { userAdded: newGroup })
      return newGroup
    }
  },
  /*Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }*/
}