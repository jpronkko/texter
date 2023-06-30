const logger = require('../utils/logger')

const Message = require('./messages.mongo')

const findMessages = async (groupId) => {
  return await Message.find({ groupId })
}

const createMessage = async (groupId, fromUser, body) => {
  logger.info('Create message', groupId, fromUser, body)
  const message = new Message({ groupId, fromUser, body })
  const result = await message.save()
  logger.info('Trying create message save', result)
  return result
}

module.exports = {
  findMessages,
  createMessage
}