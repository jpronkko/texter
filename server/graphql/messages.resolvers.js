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
  },
  Mutation: {
    createMessage: async (root, args, { currentUser }) => {
      logger.info('Create messages', args)

      checkUser(currentUser, 'Not authorized!')

      const { messageInput: { groupId, body } } = args

      if(!checkUserInGroup(currentUser, groupId)) {
        throw new GraphQLError('Not authorized! User not in group!')
      }

      const message = await messagesModel.createMessage(
        currentUser, groupId, body
      )

      pubsub.publish('MESSAGE_ADDED', {
        messageAdded: {
          groupId,
          message,
        },
      })
      return message
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MESSAGE_ADDED']),
        (payload, variables) => {
          console.log('paykload', payload)
          return payload.messageAdded.groupId === variables.groupId
        }
      )
    }
  }

}
