const { PubSub, withFilter } = require('graphql-subscriptions')
const { GraphQLError } = require('graphql')

const messagesModel = require('../models/messages.model')
const logger = require('../utils/logger')
const { checkUser, checkUserInTopicGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Mutation: {
    createMessage: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Not authorized to create a message!')

        const {
          messageInput: { topicId, body },
        } = args

        if (!checkUserInTopicGroup(currentUser, topicId)) {
          logger.error('User not in correct group', currentUser, topicId)
          throw new Error('User not in correct group!')
        }
        const message = await messagesModel.createMessage(
          currentUser,
          topicId,
          body
        )
        pubsub.publish('MESSAGE_ADDED_TO_TOPIC', {
          messageAddedToTopic: { ...message },
        })

        return message
      } catch (error) {
        logger.error('Error at create message resolver:', error)
        throw new GraphQLError('Message error resolver!', {
          extensions: { code: 'MESSAGE_ERROR', invalidArgs: args.name, error },
        })
      }
    },
  },
  Subscription: {
    messageAddedToTopic: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MESSAGE_ADDED_TO_TOPIC']),
        (payload, variables) => {
          return payload.messageAddedToTopic.topicId === variables.topicId
        }
      ),
    },
  },
}
