const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const usersModel = require('../models/users.model')
const logger = require('../utils/logger')

const { tokenFromUser, getHash } = require('../utils/pwtoken')
const { checkUser, checkUserInOwnedGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    me: (root, args, contextValue) => {
      console.log('context', contextValue)
      return contextValue.currentUser
    },
    allUsers: async () => await usersModel.getAllUsers(),
    findUser: async (root, args) =>
      await usersModel.findUser(args.username),
    getUserGroupInfo: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting user groups failed!')
      const groupInfo = await usersModel.getUserGroups(currentUser.id)
      console.log('Group Info', groupInfo)
      return groupInfo
    },
    findUserById: async (root, args) => {
      console.log(args)
      const user = await usersModel.findUserWithId(args.id)
      return user
    }
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
        return { token: tokenFromUser(newUser), user: newUser }
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
      const tokenAndUser = await usersModel.login(username, password)
      return tokenAndUser
    },
    addUserToGroup: async (root, args, { currentUser }) => {
      logger.info(`Adding user ${args.userId} to group ${args.groupId}`)

      checkUser(currentUser, 'Adding a user to a group failed!')

      const { groupId, userId } = args
      if(!checkUserInOwnedGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to add user to a group')
      }

      // should return without pw hash
      const updatedUser = await usersModel.addUserToGroup(userId, groupId)

      logger.info('Updated user', updatedUser)
      pubsub.publish('USER_ADDED_TO_GROUP', {
        userAddedToGroup: {
          userId,
          joinedGroups: updatedUser.joinedGroups,
        }
      })
      return groupId
    },
  },
  Subscription: {
    userAddedToGroup: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['USER_ADDED_TO_GROUP']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.userAddedToGroup.userId === variables.userId
        }
      )
    }
  }
}