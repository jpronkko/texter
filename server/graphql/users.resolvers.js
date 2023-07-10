const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { GraphQLError } = require('graphql')

const usersModel = require('../models/users.model')
const logger = require('../utils/logger')

const { tokenFromUser, getHash } = require('../utils/pwtoken')

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

      const user = await usersModel.findUser(args.username)
      if(user) {
        logger.error('Username taken', user)
        throw new GraphQLError( 'Username taken', { extensions: { code: 'USERNAME_TAKEN' } })
      }

      const passwordHash = await getHash(password)

      try {
        const newUser = await usersModel.createUser(
          name, username, email, passwordHash
        )
        pubsub.publish('USER_ADDED', { userAdded: newUser })
        return tokenFromUser(newUser)
      } catch(error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'USER_CREATE_FAILED',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      logger.info('Login arguments', args, args.username, args.password)
      const { credentials: { username, password } } = args
      // try {
      const token = await usersModel.login(username, password)
      return token
      /* } catch(error) {
        logger.error('Login failed', error)
        throw new GraphQLError('User login failed', {
          extensions: {
            code: 'USER_LOGIN_FAILED',
            error
          }
        })
      }*/
    }
  },
  Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }
}