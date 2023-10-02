const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const usersModel = require('../models/users.model')
const logger = require('../utils/logger')

const { tokenFromUser, getHash } = require('../utils/pwtoken')
const { checkUser, checkUserOwnsGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    me: (root, args, contextValue) => {
      console.log('context', contextValue)
      return contextValue.currentUser
    },
    allUsers: async () => await usersModel.getAllUsers(),
    findUser: async (root, args) => await usersModel.findUser(args.username),
    getUserJoinedGroups: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting user groups failed!')
      const groupInfo = await usersModel.getUserJoinedGroups(currentUser.id)
      console.log('Group Info', groupInfo)
      return groupInfo
    },
    findUserById: async (root, args) => {
      console.log(args)
      const user = await usersModel.findUserWithId(args.id)
      return user
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const {
        user: { name, username, email, password },
      } = args

      const user = await usersModel.findUser(username)
      if (user) {
        logger.error('Username taken', user)
        throw new GraphQLError('Username taken', {
          extensions: { code: 'USERNAME_TAKEN' },
        })
      }

      const passwordHash = await getHash(password)
      try {
        const newUser = await usersModel.createUser(
          name,
          username,
          email,
          passwordHash
        )
        console.log('newuser', newUser)
        pubsub.publish('USER_ADDED', { userAdded: newUser })

        return {
          token: tokenFromUser(newUser),
          userId: newUser.userId,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
        }
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'USER_CREATE_FAILED',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    login: async (root, args) => {
      logger.info('Login arguments', args, args.username, args.password)
      const {
        credentials: { username, password },
      } = args
      const tokenAndUser = await usersModel.login(username, password)
      return tokenAndUser
    },
    addUserToGroup: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Adding a user to a group failed!')

      const { groupId, userId } = args
      if (!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to add user to a group')
      }

      // should return without pw hash
      const updatedUser = await usersModel.addUserToGroup(userId, groupId)

      pubsub.publish('USER_ADDED_TO_GROUP', {
        userAddedToGroup: {
          userId,
          joinedGroups: updatedUser.groups,
        },
      })
      return groupId
    },
    updateUserRole: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Updating user role failed!')

      const { userId, groupId, role } = args
      if (!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to change user role in group!')
      }

      try {
        const updatedUser = await usersModel.updateRoleInGroup(
          userId,
          groupId,
          role
        )
        return updatedUser
      } catch (error) {
        throw new GraphQLError('User update did not work', error.message)
      }
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
      ),
    },
  },
}
