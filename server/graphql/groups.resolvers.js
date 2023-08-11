/*const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()*/
const groupsModel = require('../models/groups.model')
const logger = require('../utils/logger')
const { findUserWithId } = require('../models/users.model')
const { GraphQLError } = require('graphql')

module.exports = {
  Query: {
    getUserGroupInfo: async (root, args, { currentUser }) => {
      console.log('Cur', currentUser)
      /*if (!currentUser) {
        throw new GraphQLError('Wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }*/

      const userId = '64d354d431124339a3f368d7'
      const user = await findUserWithId(userId)
      if(!user) {
        throw new GraphQLError('Creating group failed!', {
          extensions: {
            code: 'GROUP_CREATE_FAILED',
            invalidArgs: currentUser.id
          }
        })
      }
      const groupInfo = await groupsModel.findUserGroups(userId)
      console.log('Group Info', groupInfo)
      return groupInfo
    }
  },
  Mutation: {
    createGroup: async (root, args, { currentUser }) => {
      logger.info('Create Group', args)

      /*if (!currentUser) {
        throw new GraphQLError('Wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }*/
      const { name } = args

      const userId = '64d354d431124339a3f368d7'
      const user = await findUserWithId(userId)

      if(!user) {
        throw new GraphQLError('Creating group failed!', {
          extensions: {
            code: 'GROUP_CREATE_FAILED',
            invalidArgs: userId
          }
        })
      }
      const newGroup = await groupsModel.createGroup(
        userId,
        name
      )
      //pubsub.publish('USER_ADDED', { userAdded: newGroup })
      return {
        id: newGroup.id,
        name: newGroup.name,
        ownerId: newGroup.ownerId
      }
    }
  },
  /*Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }*/
}