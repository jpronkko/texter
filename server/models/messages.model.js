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
  const populatedMessage = await message.populate({
    path: 'fromUser',
    select: '_id name',
  })
  logger.info('Trying create message save', savedMessage)

  topic.messages = topic.messages.concat(message._id)
  await topic.save()
  logger.info(
    `Saved message: ${populatedMessage} toJSON: ${JSON.stringify(
      populatedMessage.toJSON()
    )}`
  )
  return populatedMessage.toJSON()
}

module.exports = {
  getAllMessages,
  createMessage,
}
