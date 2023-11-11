const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const topicsModel = require('../models/topics.model')
const logger = require('../utils/logger')

const {
  checkUser,
  checkUserOwnsGroup,
  checkUserInTopicGroup,
} = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    allTopics: async () => await topicsModel.getAllTopics(),
    getMessages: async (root, args, { currentUser }) => {
      console.log('Get messages, current user', currentUser)
      checkUser(currentUser, 'Current user not authorized!')

      try {
        if (!checkUserInTopicGroup(currentUser, args.topicId)) {
          throw new GraphQLError('User not authorized for topic!')
        }
      } catch (error) {
        throw new GraphQLError('Check your topic id!')
      }
      const messages = await topicsModel.getMessages(args.topicId)
      return messages
    },
  },
  Mutation: {
    createTopic: async (root, args, { currentUser }) => {
      const { groupId, name } = args
      checkUser(currentUser, 'Creating a topic failed!')

      if (!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to add topic to a group')
      }

      const topic = await topicsModel.createTopic(groupId, name)
      if (!topic) {
        logger.error('Create topic failed!', topic)
        throw new GraphQLError('Topic name taken', {
          extensions: { code: 'TOPIC_NAME_TAKEN' },
        })
      }

      pubsub.publish('TOPIC_ADDED_TO_GROUP', {
        groupId,
        topicAddedToGroup: topic,
      })
      return topic
    },
  },
  Subscription: {
    topicAddedToGroup: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['TOPIC_ADDED_TO_GROUP']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.topicAdded.groupId === variables.groupId
        }
      ),
    },
  },
}
