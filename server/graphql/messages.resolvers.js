const messagesModel = require('../models/messages.model')
const logger = require('../utils/logger')
const { checkUser, checkUserInGroup } = require('../utils/checkUser')
const { GraphQLError } = require('graphql')

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
      if(!checkUserInGroup(currentUser, groupId)) {
        throw new GraphQLError('Not authorized!')
      }

      const { MessageInput: { groupId, body } } = args

      const newUser = await messagesModel.createMessage(
        currentUser, groupId, body
      )
      //pubsub.publish('USER_ADDED', { userAdded: newUser })
      return newUser
    }
  },
}
