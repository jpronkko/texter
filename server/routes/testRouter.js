const testRouter = require('express').Router()
const { mongoClearDb } = require('../services/mongo')

const groupsModel = require('../models/groups.model')
const usersModel = require('../models/users.model')
// const Group = require('../models/groups.mongo')
// const Topic = require('../models/topics.mongo')
// const Message = require('../models/messages.mongo')
// const Invitation = require('../models/messages.mongo')

const { getHash } = require('../utils/pwtoken')
const testUsers = require('../utils/testUsers')
const logger = require('../utils/logger')

testRouter.get('/users', async (request, response) => {
  const results = await usersModel.getAllUsers()
  response.send(results)
})

testRouter.post('/addusers', async (request, response) => {
  logger.info('Adding test users...')
  const group = await groupsModel.findOrCreateCommonGroup()

  for (const testUser of testUsers) {
    const pwhash = await getHash(testUser.password)
    const user = await usersModel.createUser(
      testUser.name,
      testUser.username,
      testUser.email,
      pwhash
    )
    logger.info('Created user', user)
    const updatedUser = await usersModel.addUserToGroup(
      user.userId,
      group.id,
      'ADMIN'
    )
    logger.info('Added user to common group:', updatedUser)
  }
  logger.info('Done adding test users.')
  response.status(204).end()
})

testRouter.post('/reset', async (request, response) => {
  logger.info('Emptying database collections.')
  await mongoClearDb()
  response.status(204).end()
})

module.exports = testRouter
