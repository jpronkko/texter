const logger = require('../utils/logger')

const Group = require('./groups.mongo')

const findUserGroups = async (userId) => {
  return await Group.find({ userId })
}

const createGroup = async (userId, name) => {
  logger.info('createGroup')
  const group = new Group({ ownerId: userId, name })
  return await group.save()
}

module.exports = {
  findUserGroups,
  createGroup,
}
