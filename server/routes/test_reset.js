const testRouter = require('express').Router()
const User = require('../models/users.mongo')

testRouter.post('/reset', async (request, response) => {
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testRouter