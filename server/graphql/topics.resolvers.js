const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const topicsModel = require('../models/topics.model')
const logger = require('../utils/logger')

const {
  checkUser,
  checkUserOwnsGroup,
  checkUserInTopicGroup,
  checkUserOwnsOrIsAdminInGroup,
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

      if (!checkUserOwnsOrIsAdminInGroup(currentUser, groupId)) {
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
    removeTopic: async (root, args, { currentUser }) => {
      const { groupId, topicId } = args
      checkUser(currentUser, 'Removing a topic failed!')

      if (!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to add topic to a group')
      }
      const topic = await topicsModel.removeTopic(topicId)
      if (!topic) {
        logger.error('Remove topic failed!', topic)
        throw new GraphQLError('Remove topic failed!', {
          extensions: { code: 'REMOVE_TOPIC_FAILED' },
        })
      }

      pubsub.publish('TOPIC_REMOVED', {
        groupId: topic.groupId,
        topicRemoved: topic,
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
          return payload.topicAddedToGroup.groupId === variables.groupId
        }
      ),
    },
    topicRemoved: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['TOPIC_REMOVED']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.topicRemoved.groupId === variables.groupId
        }
      ),
    },
  },
}
