const logger = require('../utils/logger')

const Message = require('./messages.mongo')
const Topic = require('./topics.mongo')

const getAllMessages = async () => {
  return await Message.find({})
}

const createMessage = async (user, topicId, body) => {
  const topic = await Topic.findById(topicId)
  if(!topic) {
    throw new Error(`No such topic found! ${topicId}`)
  }

  logger.info('Create message', topicId, user.id, topic, body)

  const message = new Message({ fromUser: user.id, body, sentTime: Date.now() })
  const savedMessage = await message.save()
  logger.info('Trying create message save', savedMessage)

  topic.messages = topic.messages.concat(message._id)
  await topic.save()
  console.log(`saved message: ${savedMessage}`)
  return savedMessage.toJSON()
}

module.exports = {
  getAllMessages,
  createMessage
}