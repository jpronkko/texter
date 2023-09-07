const Topic = require('./topics.mongo')
const Group = require('./groups.mongo')
const logger = require('../utils/logger')

const getAllTopics = async () => {
  const topics = await Topic
    .find({})
  return topics.map(topic => topic.toJSON())
}

const findTopic = async (id) => {
  const topic = await Topic.findById(id)
  if (!topic) {
    logger.error(`Topic with id ${id} not found!`)
    return null
  }
  return topic.toJSON()
}

const getMessages = async (topicId) => {
  logger.info('Trying to find messages with topicId:', topicId)
  const topic = await Topic
    .findOne({ _id: topicId })
    .populate(
      { path: 'messages',
        model: 'Message',
        populate: {
          path: 'fromUser',
          model: 'User',
          select: 'name'
        }
      }
    )
  if(topic) {
    logger.info('Messages', topic.messages)
    return topic.messages.map(message => message.toJSON())
  }
  return null
}

const createTopic = async (groupId, name) => {
  const existingTopic = await Topic.findOne({ groupId, name })
  if (existingTopic) {
    throw Error('Topic name taken')
  }

  const group = await Group.findById(groupId)
  if(!group) {
    throw new Error('No such group found!')
  }

  const topic = new Topic({ groupId, name })
  const savedTopic = await topic.save()
  if(!savedTopic) {
    throw new Error('Topic save failed!')
  }
  group.topics = group.topics.concat(topic.id)
  await group.save()
  return savedTopic.toJSON()
}

module.exports = {
  getAllTopics,
  findTopic,
  getMessages,
  createTopic,
}