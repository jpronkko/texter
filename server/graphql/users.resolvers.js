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
    getUserJoinedGroups: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')
        const joinedGroups = await usersModel.getUserJoinedGroups(
          currentUser.id
        )
        return { userId: currentUser.id, joinedGroups }
      } catch (error) {
        logger.error('Getting user joined groups failed', error)
        throw new GraphQLError(error.message)
      }
    },

    getUsersNotInGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')
        const { groupId } = args
        const usersNotInGroup = await usersModel.getUsersNotInGroup(groupId)
        return usersNotInGroup
      } catch (error) {
        logger.error('Getting users not in group failed', error)
        throw new GraphQLError(error.message)
      }
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const {
        user: { name, username, email, password },
      } = args

      // Password length can't be validated by mongoose as only hash is stored
      if (password.length < MIN_PASSWORD_LENGTH) {
        logger.error('Create user: password too short')
        throw new GraphQLError('password too short')
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
          'ADMIN'
        )

        if (!userGroupRole) {
          throw new GraphQLError('Adding user to common group failed!')
        }
        pubsub.publish('USER_ADDED', { userAdded: newUser })

        return tokenAndUser
      } catch (error) {
        logger.error('Creating user failed', error)
        throw new GraphQLError(error.message)
      }
    },

    login: async (root, args) => {
      try {
        const {
          credentials: { username, password },
        } = args

        logger.info('Login attempt:', username)
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
      try {
        checkUser(currentUser, 'not authorized')
        const { oldPassword, newPassword } = args

        const correctPW = await usersModel.compUserPWWithHash(
          currentUser.id,
          oldPassword
        )

        if (!correctPW) {
          logger.error('Wrong password', currentUser.username)
          throw new Error('wrong password')
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
          throw new Error('password too short')
        }

        const userBaseData = await usersModel.changePassword(
          currentUser.id,
          newPassword
        )
        return userBaseData
      } catch (error) {
        logger.error('Changing password failed')
        throw new GraphQLError(error.message)
      }
    },

    changeEmail: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')
        const { password, newEmail } = args

        const correctPW = await usersModel.compUserPWWithHash(
          currentUser.id,
          password
        )

        if (!correctPW) {
          logger.error('Wrong password', currentUser.username)
          throw new Error('wrong password')
        }

        const userBaseData = await usersModel.changeEmail(
          currentUser.id,
          newEmail
        )
        return userBaseData
      } catch (error) {
        logger.error('Changing e-mail failed', error.message)
        throw new GraphQLError(error.message)
      }
    },

    addUserToGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        const { groupId, userId } = args
        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new Error('no permission to add user to a group')
        }
        if (currentUser.id === userId) {
          throw new Error('trying to add oneself to a group')
        }
        // Return user information without password hash
        const userGroupRole = await usersModel.addUserToGroup(
          userId,
          groupId,
          'MEMBER'
        )

        pubsub.publish('USER_ADDED_TO_GROUP', {
          userId,
          userAddedToGroup: {
            ...userGroupRole,
          },
        })
        return userGroupRole
      } catch (error) {
        logger.error('Adding user to group failed', error)
        throw new GraphQLError(error.message)
      }
    },

    removeUserFromGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        const { userId, groupId } = args

        const userIsInGroup = checkUserInGroup(currentUser, groupId)
        if (!userIsInGroup) {
          throw new GraphQLError('user is not in group')
        }

        const userOwnsGroup = checkUserOwnsGroup(currentUser, groupId)

        // If user is group owner one can remove other users from the group
        // If user is deleting him/herself from the group, it is allowed
        if (!userOwnsGroup && currentUser.id !== userId) {
          throw new GraphQLError('no permission to remove user from group')
        }

        const result = await usersModel.removeUserFromGroup(userId, groupId)

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
        throw new GraphQLError(error.message)
      }
    },

    updateUserRole: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        const { userId, groupId, role } = args
        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new Error('no permission to change user role in group')
        }

        const userGroupRole = await usersModel.updateRoleInGroup(
          userId,
          groupId,
          role
        )
        return userGroupRole
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
  },

  Subscription: {
    userAddedToGroup: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['USER_ADDED_TO_GROUP']),
        (payload, variables) => {
          return payload.userAddedToGroup.userId === variables.userId
        }
      ),
    },
    userRemovedFromGroup: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['USER_REMOVED_FROM_GROUP']),
        (payload, variables) => {
          return payload.userRemovedFromGroup.userId === variables.userId
        }
      ),
    },
  },
}
