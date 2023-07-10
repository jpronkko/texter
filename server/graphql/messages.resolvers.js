const messagesModel = require('../models/messages.model')
const logger = require('../utils/logger')

module.exports = {
  Query: {
    findMessages: async (groupId) => await messagesModel.findMessages(groupId),
  },
  Mutation: {
    createMessage: async (root, args) => {
      logger.info('Create messages', args)
      const { MessageInput: { groupId, fromUserId, body } } = args

      const newUser = await messagesModel.createMessage(
        groupId, fromUserId, body
      )
      //pubsub.publish('USER_ADDED', { userAdded: newUser })
      return newUser
    }
  },
}