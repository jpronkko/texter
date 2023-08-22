const logger = require('../utils/logger')

const Message = require('./messages.mongo')

const { findGroup } = require('./groups.model')

const getAllMessages = async () => {
  return await Message.find({})
}

const createMessage = async (user, groupId, body) => {
  const group = await findGroup(groupId)
  if(!group) {
    throw new Error(`No such group found! ${groupId}`)
  }

  logger.info('Create message', groupId, user.id, group, body)

  const message = new Message({ fromUser: user.id, body, sentTime: Date.now() })
  const result = await message.save()
  logger.info('Trying create message save', result)

  group.messages = group.messages.concat(message._id)
  await group.save()
  return result
}

module.exports = {
  getAllMessages,
  createMessage
}