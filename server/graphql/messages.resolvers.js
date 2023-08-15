const messagesModel = require('../models/messages.model')
const logger = require('../utils/logger')
const { checkUser, checkUserInGroup } = require('../utils/checkUser')
const { GraphQLError } = require('graphql')
const { PubSub, withFilter } = require('graphql-subscriptions')

const pubsub = new PubSub()

module.exports = {
  Query: {
    allMessages: async () => {
      return await messagesModel.getAllMessages()
    },
    findMessages: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Not authorized!')
      const { groupId } = args
      if(!checkUserInGroup(currentUser, groupId)) {
        throw new GraphQLError('Not authorized!')
      }
      const messages = await messagesModel.findMessages(groupId)
      return messages
    }
  },
  Mutation: {
    createMessage: async (root, args, { currentUser }) => {
      logger.info('Create messages', args)

      checkUser(currentUser, 'Not authorized!')

      const { MessageInput: { groupId, body } } = args

      if(!checkUserInGroup(currentUser, groupId)) {
        throw new GraphQLError('Not authorized!')
      }

      const message = await messagesModel.createMessage(
        currentUser, groupId, body
      )

      pubsub.publish('MESSAGE_ADDED', { messageAdded: message, groupId })
      return message
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          return payload.groupId === variables.groupId
        }
      )
    }
  }

}
