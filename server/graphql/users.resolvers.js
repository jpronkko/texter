const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const usersModel = require('../models/users.model')
const logger = require('../utils/logger')

const { getHash } = require('../utils/pwtoken')
const {
  checkUser,
  checkUserOwnsGroup,
  checkUserInGroup,
} = require('../utils/checkUser')

const { MIN_PASSWORD_LENGTH } = require('../utils/config')
const { findOrCreateCommonGroup } = require('../models/groups.model')

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
      return {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      }
    },
    allUsers: async () => await usersModel.getAllUsers(),

    getUserJoinedGroups: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting user groups failed!')
      const joinedGroups = await usersModel.getUserJoinedGroups(currentUser.id)
      console.log('Users resolver get user joined groups:', joinedGroups)
      return { userId: currentUser.id, joinedGroups }
    },
    getUsersNotInGroup: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting users not in group failed!')
      const { groupId } = args
      const usersNotInGroup = await usersModel.getUsersNotInGroup(groupId)
      return usersNotInGroup
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const {
        user: { name, username, email, password },
      } = args

      if (password.length < MIN_PASSWORD_LENGTH) {
        logger.error('Create user: password too short')
        throw new GraphQLError('Password too short!', {
          extensions: {
            code: 'USER_CREATE_FAILED',
            invalidArgs: args.user.password,
          },
        })
      }

      try {
        const passwordHash = await getHash(password)

        const newUser = await usersModel.createUser(
          name,
          username,
          email,
          passwordHash
        )

        const tokenAndUser = await usersModel.login(username, password)
        const commonGroup = await findOrCreateCommonGroup()

        const userGroupRole = await usersModel.addUserToGroup(
          tokenAndUser.userId,
          commonGroup.id,
          'MEMBER'
        )

        if (!userGroupRole) {
          throw new GraphQLError('Adding user to common group failed!')
        }
        pubsub.publish('USER_ADDED', { userAdded: newUser })

        return tokenAndUser
      } catch (error) {
        logger.error('Creating user failed', error, error.message)
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'USER_CREATE_FAILED',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },

    login: async (root, args) => {
      logger.info('Login with arguments', args)
      const {
        credentials: { username, password },
      } = args

      try {
        const tokenAndUser = await usersModel.login(username, password)
        return tokenAndUser
      } catch (error) {
        logger.error('Login failed', error)
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          },
        })
      }
    },

    changePassword: async (root, args, { currentUser }) => {
      logger.info('Change password arguments', args)
      checkUser(currentUser, 'Changing password failed!')
      const { oldPassword, newPassword } = args

      if (newPassword.length < MIN_PASSWORD_LENGTH) {
        throw new GraphQLError('Password too short!', {
          extensions: {
            code: 'USER_CREATE_FAILED',
            invalidArgs: args.password,
          },
        })
      }

      const correctPW = await usersModel.compUserPWWithHash(
        currentUser.id,
        oldPassword
      )
      console.log('Correct pw', correctPW)

      if (!correctPW) {
        logger.error('Wrong password', currentUser, oldPassword)
        throw new GraphQLError('Wrong password')
      }

      const userBaseData = await usersModel.changePassword(
        currentUser.id,
        newPassword
      )
      return userBaseData
    },

    changeEmail: async (root, args, { currentUser }) => {
      logger.info('Change email arguments', args)
      checkUser(currentUser, 'Changing email failed!')
      const { password, newEmail } = args

      if (!usersModel.compUserPWWithHash(currentUser.id, password)) {
        throw new GraphQLError('Wrong password')
      }

      const userBaseData = await usersModel.changeEmail(
        currentUser.id,
        newEmail
      )
      return userBaseData
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

    removeUserFromGroup: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Removing user from group failed!')

      const { userId, groupId } = args

      try {
        const userIsInGroup = checkUserInGroup(currentUser, groupId)
        if (!userIsInGroup) {
          throw new GraphQLError('User is not in group!')
        }

        const userOwnsGroup = checkUserOwnsGroup(currentUser, groupId)

        // If user is group owner one can remove other users from the group
        // If user is deleting him/herself from the group, it is allowed
        if (!userOwnsGroup && currentUser.id !== userId) {
          throw new GraphQLError('No permission to remove user from group!')
        }

        const result = await usersModel.removeUserFromGroup(userId, groupId)
        console.log('---- Result of user removal from group', result)

        pubsub.publish('USER_REMOVED_FROM_GROUP', {
          userId,
          userRemovedFromGroup: {
            userId,
            joinedGroups: result.joinedGroups,
          },
        })
        return result.userGroupRole
      } catch (error) {
        logger.error('Removing user from group failed', error)
        throw new GraphQLError('User removal did not work', error.message)
      }
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
    userRemovedFromGroup: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['USER_REMOVED_FROM_GROUP']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.userRemovedFromGroup.userId === variables.userId
        }
      ),
    },
  },
}
