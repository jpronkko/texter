const testRouter = require('express').Router()
const User = require('../models/users.mongo')
const { getHash } = require('../utils/pwtoken')

const testUsers = [
  {
    username: 'anni',
    name: 'Anni',
    email: 'anni@klonkku.com',
    password: 'klonksahtava'
  },
  {
    username: 'sonja',
    name: 'Sonja',
    email: 'sonja@mordor.com',
    password: 'eyeofsauron'
  },
  {
    username: 'rape',
    name: 'Raimo Yläsurakka',
    email: 'rape@moottori.com',
    password: 'hilpatihalpati'
  },
]

testRouter.get('/users', async (request, response) => {
  const results = await User.find({})
  response.send(results)
})

testRouter.post('/addusers', async (request, response) => {
  await User.insertMany( testUsers.map(user => ({
    name: user.name,
    username: user.username,
    email: user.email,
    passwordHash: await getHash(user.password)
  })) )

  response.status(204).end()
})

testRouter.post('/reset', async (request, response) => {
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testRouter