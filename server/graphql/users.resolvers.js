const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { GraphQLError } = require('graphql')

const usersModel = require('../models/users.model')
const logger = require('../utils/logger')
const User = require('../models/users.mongo')

const { tokenFromUser, getHash, pwCompare } = require('../utils/pwtoken')

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

      const user = await User.findOne({ username: args.username })
      if(user) {
        throw new GraphQLError( 'Username taken', { extensions: { code: 304 } })
      }
      const passwordHash = await getHash(password)
      const newUser = await usersModel.createUser(
        name, username, email, passwordHash
      )
      pubsub.publish('USER_ADDED', { userAdded: newUser })

      return tokenFromUser(newUser)
    },
    login: async (root, args) => {
      logger.info('Login ', args.username)
      const user = await User.findOne({ username: args.username })

      const passwordCorrect = user === null ? false :
        pwCompare(args.password, user.passwordHash)

      if (!passwordCorrect) {
        throw new GraphQLError( 'Wrong credentials', { extensions: { code: 304 } })
      }

      return tokenFromUser(user)
    }
  },
  Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }
}