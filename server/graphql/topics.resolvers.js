const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const topicsModel = require('../models/topics.model')
const logger = require('../utils/logger')

const { checkUser, checkUserOwnsGroup, checkUserInTopicGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    allTopics: async () => await topicsModel.getAllTopics(),
    getMessages: async (root, args, { currentUser }) => {
      console.log('Get messages, current user', currentUser)
      checkUser(currentUser, 'Not authorized 1!')

      if(!checkUserInTopicGroup(currentUser, args.topicId)) {
        throw new GraphQLError('Not authorized 2!')
      }
      const messages = await topicsModel.getMessages(args.topicId)
      return messages
    },
  },
  Mutation: {
    createTopic: async (root, args, { currentUser }) => {
      logger.info('Topic args', args)
      const { groupId, name } = args
      checkUser(currentUser, 'Creating a topic failed!')

      if(!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to add topic to a group')
      }

      const topic = await topicsModel.createTopic(groupId, name)
      if(!topic) {
        logger.error('Create topic failed!', topic)
        throw new GraphQLError( 'Topic name taken', { extensions: { code: 'TOPIC_NAME_TAKEN' } })
      }

      pubsub.publish('TOPIC_ADDED', { groupId, topicAdded: topic })
      return topic
    },
  },
  Subscription: {
    topicAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['TOPIC_ADDED']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.topicAdded.groupId === variables.groupId
        }
      )
    },
  }
}