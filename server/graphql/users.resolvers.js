const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const usersModel = require('../models/users.model')
const logger = require('../utils/logger')

const { getHash } = require('../utils/pwtoken')
const { checkUser, checkUserOwnsGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    me: (root, args, contextValue) => {
      console.log('context', contextValue)
      return contextValue.currentUser
    },
    getUserBaseData: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting user data failed!')
      const user = await usersModel.findUserWithId(currentUser.id)
      console.log('user', user)
      return { id: user.id, username: user.username, name: user.name }
    },
    allUsers: async () => await usersModel.getAllUsers(),
    //findUser: async (root, args) => await usersModel.findUser(args.username),
    getUserJoinedGroups: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting user groups failed!')
      const groupInfo = await usersModel.getUserJoinedGroups(currentUser.id)
      console.log('Group Info', groupInfo)
      return { userId: currentUser.id, joinedGroups: groupInfo }
    },
    /*findUserById: async (root, args) => {
      console.log(args)
      const user = await usersModel.findUserWithId(args.id)
      return user
    },*/
  },
  // JoinedGroup: {
  //   group: async (parent) => {
  //     console.log('group args', parent)
  //     const group = await groupsModel.findGroup(parent.group)
  //     return { groupId: group.id, grouName: group.name, ownerId: group.ownerId }
  //   },
  // },

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

        const tokenAndUser = await usersModel.login(username, password)
        return tokenAndUser
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
      console.log('Add user to group', userId, groupId, currentUser.id)

      if (!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to add user to a group')
      }
      if (currentUser.id === userId) {
        throw new GraphQLError('Trying to add oneself to a group')
      }
      // should return without pw hash
      const userGroupRole = await usersModel.addUserToGroup(
        userId,
        groupId,
        'MEMBER'
      )
      console.log('addusertog', userGroupRole)

      pubsub.publish('USER_ADDED_TO_GROUP', {
        userId,
        userAddedToGroup: {
          ...userGroupRole,
        },
      })
      return userGroupRole
    },
    updateUserRole: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Updating user role failed!')

      const { userId, groupId, role } = args
      if (!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to change user role in group!')
      }

      try {
        const userGroupRole = await usersModel.updateRoleInGroup(
          userId,
          groupId,
          role
        )
        return userGroupRole
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
