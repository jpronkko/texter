const logger = require('../utils/logger')

const Message = require('./messages.mongo')

const { findGroup } = require('./groups.model')

const findMessages = async (groupId) => {
  return await Message.find({ groupId })
}

const createMessage = async (groupId, fromUserId, body) => {

  const group = await findGroup(groupId)
  if(!group) {
    throw new Error(`No such group found! ${groupId}`)
  }

  logger.info('Create message', groupId, fromUserId, group, body)

  if(fromUserId !== group.ownerId.toString()) {
    throw new Error('Not owner of a message group!')
  }

  const message = new Message({ groupId, fromUserId, body })
  const result = await message.save()
  logger.info('Trying create message save', result)
  return result
}

module.exports = {
  findMessages,
  createMessage
}