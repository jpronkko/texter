const { PubSub, withFilter } = require('graphql-subscriptions')
const { GraphQLError } = require('graphql')

const messagesModel = require('../models/messages.model')
const logger = require('../utils/logger')
const { checkUser, checkUserInTopicGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    allMessages: async () => {
      return await messagesModel.getAllMessages()
    },
  },
  Mutation: {
    createMessage: async (root, args, { currentUser }) => {
      console.log('resolver createMessage args', args)
      checkUser(currentUser, 'Not authorized to create a message!')

      const {
        messageInput: { topicId, body },
      } = args

      try {
        if (!checkUserInTopicGroup(currentUser, topicId)) {
          logger.error('User not in correct group', currentUser, topicId)
          throw new GraphQLError('User not in correct group!', {
            extensions: { code: 'WRONG_GROUP' },
          })
        }
        const message = await messagesModel.createMessage(
          currentUser,
          topicId,
          body
        )
        pubsub.publish('MESSAGE_ADDED_TO_TOPIC', {
          messageAddedToTopic: { ...message },
        })
        console.log(
          'msg:',
          JSON.stringify(message),
          JSON.stringify(message.fromUser)
        )
        return message
      } catch (error) {
        logger.error('Error:', error)
        throw new GraphQLError('Message error!')
      }
    },
  },
  Subscription: {
    messageAddedToTopic: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MESSAGE_ADDED_TO_TOPIC']),
        (payload, variables) => {
          console.log('msg added subs paload', payload)
          return payload.messageAddedToTopic.topicId === variables.topicId
        }
      ),
    },
  },
}
