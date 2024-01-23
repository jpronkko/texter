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
    getMessages: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'not authorized')

      try {
        if (!checkUserInTopicGroup(currentUser, args.topicId)) {
          throw new Error('user not authorized for topic')
        }
      } catch (error) {
        throw new GraphQLError(error.message)
      }
      const messages = await topicsModel.getMessages(args.topicId)
      return messages
    },
  },
  Mutation: {
    createTopic: async (root, args, { currentUser }) => {
      try {
        const { groupId, name } = args
        checkUser(currentUser, 'Creating a topic failed!')

        if (!checkUserOwnsOrIsAdminInGroup(currentUser, groupId)) {
          throw new Error('no permission to add topic to a group')
        }

        const topic = await topicsModel.createTopic(groupId, name)
        if (!topic) {
          logger.error('Create topic failed!', topic)
          throw new Error('topic name taken')
        }

        pubsub.publish('TOPIC_ADDED_TO_GROUP', {
          groupId,
          topicAddedToGroup: topic,
        })
        return topic
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
    removeTopic: async (root, args, { currentUser }) => {
      try {
        const { groupId, topicId } = args
        checkUser(currentUser, 'not authorized')

        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new Error('no permission to add topic to a group')
        }
        const topic = await topicsModel.removeTopic(topicId)
        if (!topic) {
          logger.error('Remove topic failed!', topic)
          throw new Error('remove topic failed')
        }

        pubsub.publish('TOPIC_REMOVED', {
          groupId: topic.groupId,
          topicRemoved: topic,
        })
        return topic
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
  },
  Subscription: {
    topicAddedToGroup: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['TOPIC_ADDED_TO_GROUP']),
        (payload, variables) => {
          return payload.topicAddedToGroup.groupId === variables.groupId
        }
      ),
    },
    topicRemoved: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['TOPIC_REMOVED']),
        (payload, variables) => {
          return payload.topicRemoved.groupId === variables.groupId
        }
      ),
    },
  },
}
