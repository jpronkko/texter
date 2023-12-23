const Group = require('./groups.mongo')
const Message = require('./messages.mongo')
const Topic = require('./topics.mongo')
const logger = require('../utils/logger')

const getAllTopics = async () => {
  const topics = await Topic.find({})
  return topics.map((topic) => topic.toJSON())
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
  const topic = await Topic.findById(topicId).populate({
    path: 'messages',
    model: 'Message',
    populate: {
      path: 'fromUser',
      model: 'User',
      select: '_id name',
    },
  })

  if (!topic) {
    logger.error(`No topic with id ${topicId} found!`)
    throw new Error('no such topic')
  }

  const messagesJSON = topic.messages.map((message) => ({
    ...message.toJSON(),
    fromUser: message.fromUser.toJSON(),
  }))

  return messagesJSON
}

const createTopic = async (groupId, name) => {
  const existingTopic = await Topic.findOne({ groupId, name })
  if (existingTopic) {
    throw Error('topic name taken')
  }

  const group = await Group.findById(groupId)
  if (!group) {
    throw new Error('no such group found')
  }

  const topic = new Topic({ groupId, name })
  const savedTopic = await topic.save()
  if (!savedTopic) {
    throw new Error('topic save failed')
  }
  group.topics = group.topics.concat(topic.id)
  await group.save()
  return savedTopic.toJSON()
}

const removeTopic = async (topicId) => {
  const topicToRemove = await Topic.findByIdAndDelete(topicId)
  if (!topicToRemove) {
    throw new Error('topic not found!')
  }
  await Message.deleteMany({ topicId })
  return topicToRemove.toJSON()
}

module.exports = {
  getAllTopics,
  findTopic,
  getMessages,
  createTopic,
  removeTopic,
}
