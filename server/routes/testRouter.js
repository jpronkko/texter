const testRouter = require('express').Router()
const User = require('../models/users.mongo')
const Group = require('../models/groups.mongo')
const Message = require('../models/messages.mongo')

const { getHash } = require('../utils/pwtoken')
const testUsers = require('../utils/testUsers')
const logger = require('../utils/logger')

testRouter.get('/users', async (request, response) => {
  const results = await User.find({})
    .catch((err) => {
      logger.error(JSON.stringify(err))
      response.status(500).json(err)
    })
  response.send(results)
})

testRouter.post('/addusers', async (request, response) => {

  const userPromises = testUsers.map(async user => ({
    name: user.name,
    username: user.username,
    email: user.email,
    passwordHash: await getHash(user.password)
  }))
  await User.insertMany(await Promise.all(userPromises))
    .catch((err) => {
      logger.error(JSON.stringify(err))
      response.status(500).json(err)
    })

  response.status(204).end()
})

testRouter.post('/reset', async (request, response) => {
  await User.deleteMany({})
    .catch((err) => {
      logger.error(JSON.stringify(err))
      response.status(500).json(err)
    })

  await User.deleteMany({})
    .catch((err) => {
      logger.error(JSON.stringify(err))
      response.status(500).json(err)
    })

  await Group.deleteMany({})
    .catch((err) => {
      logger.error(JSON.stringify(err))
      response.status(500).json(err)
    })

  await Message.deleteMany({})
    .catch((err) => {
      logger.error(JSON.stringify(err))
      response.status(500).json(err)
    })
  response.status(204).end()
})

module.exports = testRouter