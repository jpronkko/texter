const logger = require('../utils/logger')

const Message = require('./messages.mongo')
const Topic = require('./topics.mongo')

const getAllMessages = async () => {
  return await Message.find({})
}

const createMessage = async (user, topicId, body) => {
  logger.info(
    `Create message, user: ${JSON.stringify(
      user
    )}, topic: ${topicId}, body: ${body}`
  )

  const topic = await Topic.findById(topicId)
  if (!topic) {
    logger.error('No such topic found:', topicId)
    throw new Error(`No such topic found! ${topicId}`)
  }

  const message = new Message({
    topicId,
    fromUser: user.id,
    body,
    sentTime: Date.now(),
  })
  const savedMessage = await message.save()
  if (!savedMessage) {
    logger.error('Message save failed:', message)
    throw new Error(`Message save failed! ${message}`)
  }

  topic.messages = topic.messages.concat(message._id)
  const savedTopic = await topic.save()
  if (!savedTopic) {
    logger.error('Topic save failed:', topic)
    throw new Error(`Topic save failed! ${topic}`)
  }
  return { ...savedMessage.toJSON(), fromUser: { id: user.id, name: user.name } }
}

module.exports = {
  getAllMessages,
  createMessage,
}
