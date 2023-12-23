const ObjectId = require('mongoose').Types.ObjectId
const Message = require('./messages.mongo')
const Topic = require('./topics.mongo')

const logger = require('../utils/logger')

const createMessage = async (user, topicId, body) => {
  if (!ObjectId.isValid(topicId)) {
    logger.error('Invalid topicId:', topicId)
    throw new Error(`Invalid topicId! ${topicId}`)
  }

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
    throw new Error('message save failed')
  }

  topic.messages = topic.messages.concat(message._id)
  const savedTopic = await topic.save()
  if (!savedTopic) {
    logger.error('Topic save failed:', topic)
    throw new Error('Topic save failed!')
  }
  return {
    ...savedMessage.toJSON(),
    fromUser: { id: user.id, name: user.name },
  }
}

module.exports = {
  createMessage,
}
