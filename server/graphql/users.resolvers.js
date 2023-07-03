const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const usersModel = require('../models/users.model')
const logger = require('../utils/logger')

module.exports = {
  Query: {
    allUsers: async () => await usersModel.getAllUsers(),
    findUser: async (root, args) =>
      await usersModel.findUser(args.username)
  },
  Mutation: {
    createUser: async (root, args) => {
      logger.info('UserInput', args)
      const { user: { name, username, email, password } } = args

      const newUser = await usersModel.createUser(
        name, username, email, password
      )
      pubsub.publish('USER_ADDED', { userAdded: newUser })
      return newUser
    }
  },
  Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }
}