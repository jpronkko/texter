const logger = require('../utils/logger')

const Message = require('./messages.mongo')

const { findTopic } = require('./topics.model')

const getAllMessages = async () => {
  return await Message.find({})
}

const createMessage = async (user, topicId, body) => {
  const topic = await findTopic(topicId)
  if(!topic) {
    throw new Error(`No such group found! ${topicId}`)
  }

  logger.info('Create message', topicId, user.id, topic, body)

  const message = new Message({ fromUser: user.id, body, sentTime: Date.now() })
  const result = await message.save()
  logger.info('Trying create message save', result)

  topic.messages = topic.messages.concat(message._id)
  await topic.save()
  return result
}

module.exports = {
  getAllMessages,
  createMessage
}