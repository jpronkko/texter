const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const usersModel = require('../models/users.model')

module.exports = {
  Query: {
    allUsers: async () => await usersModel.getAllUsers(),
    findUser: async (root, args) =>
      await usersModel.findUser(args.username)
  },
  Mutation: {
    createUser: async (root, args) => {
      const newUser = await usersModel.createUser(args.name, args.username, args.password)
      pubsub.publish('USER_ADDED', { userAdded: newUser })
      return newUser
    }
  },
  Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }
}