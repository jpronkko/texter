const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const usersModel = require('../models/users.model')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../utils/config')
const User = require('../models/users.mongo')

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

      const passwordHash = await bcrypt.hash(password)
      const newUser = await usersModel.createUser(
        name, username, email, password, passwordHash
      )
      pubsub.publish('USER_ADDED', { userAdded: newUser })
      return newUser
    },
    login: async (root, args) => {
      logger.info('Login ', args.username)
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user === null ? false :
        await bcrypt.compare(args.password, user.passwordHash)

      if (!passwordCorrect) {
        //throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { token: jwt.sign(userForToken, config.JWT_SECRET), favoriteGenre: user.favoriteGenre }
    }
  },
  Subscription: {
    userAdded: () => pubsub.asyncIterator('USER_ADDED')
  }
}