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
        checkUser(currentUser, 'Getting user groups failed, not authorized!')
        const joinedGroups = await usersModel.getUserJoinedGroups(
          currentUser.id
        )
        return { userId: currentUser.id, joinedGroups }
      } catch (error) {
        logger.error('Getting user joined groups failed', error)
        throw new GraphQLError(
          'Getting user joined groups failed',
          error.message
        )
      }
    },

    getUsersNotInGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Getting users not in group failed!')
        const { groupId } = args
        const usersNotInGroup = await usersModel.getUsersNotInGroup(groupId)
        return usersNotInGroup
      } catch (error) {
        logger.error('Getting users not in group failed', error)
        throw new GraphQLError(
          'Getting users not in group failed',
          error.message
        )
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
      try {
        const {
          credentials: { username, password },
        } = args

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
        checkUser(currentUser, 'Changing password failed!')
        const { oldPassword, newPassword } = args

        const correctPW = await usersModel.compUserPWWithHash(
          currentUser.id,
          oldPassword
        )

        if (!correctPW) {
          logger.error('Wrong password', currentUser.username)
          throw new Error('Wrong password')
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
          throw new Error('Password too short!')
        }

        const userBaseData = await usersModel.changePassword(
          currentUser.id,
          newPassword
        )
        return userBaseData
      } catch {
        logger.error('Changing password failed')
        throw new GraphQLError('Changing password failed')
      }
    },

    changeEmail: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Changing email failed!')
        const { password, newEmail } = args

        const correctPW = await usersModel.compUserPWWithHash(
          currentUser.id,
          password
        )

        if (!correctPW) {
          logger.error('Wrong password', currentUser.username)
          throw new Error('Wrong password')
        }

        const userBaseData = await usersModel.changeEmail(
          currentUser.id,
          newEmail
        )
        return userBaseData
      } catch {
        logger.error('Changing email failed')
        throw new GraphQLError('Changing email failed')
      }
    },

    addUserToGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Adding a user to a group failed!')

        const { groupId, userId } = args
        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new Error('No permission to add user to a group')
        }
        if (currentUser.id === userId) {
          throw new Error('Trying to add oneself to a group')
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
        throw new GraphQLError('Adding user to group failed', error.message)
      }
    },

    removeUserFromGroup: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Removing user from group failed!')

        const { userId, groupId } = args

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
      try {
        checkUser(currentUser, 'Updating user role failed!')

        const { userId, groupId, role } = args
        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new Error('No permission to change user role in group!')
        }

        const userGroupRole = await usersModel.updateRoleInGroup(
          userId,
          groupId,
          role
        )
        return userGroupRole
      } catch (error) {
        throw new GraphQLError('User update failed!', error.message)
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
