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
      checkUser(currentUser, 'Not authorized!')

      const { messageInput: { topicId, body } } = args

      try {
        if(!checkUserInTopicGroup(currentUser, topicId)) {
          throw new GraphQLError('User not in correct group!', { extensions: { code: 'WRONG_GROUP' } })
        }
        const message = await messagesModel.createMessage(
          currentUser, topicId, body
        )
        pubsub.publish('MESSAGE_ADDED', {
          messageAdded: {
            topicId,
            message,
          },
        })
        return message
      } catch(error) {
        throw new GraphQLError('Topic id error!')
      }
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MESSAGE_ADDED']),
        (payload, variables) => {
          console.log('msg added subs paload', payload)
          return payload.messageAdded.topicId === variables.topicId
        }
      )
    }
  }

}
