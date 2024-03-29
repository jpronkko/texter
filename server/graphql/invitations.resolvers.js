const { PubSub, withFilter } = require('graphql-subscriptions')
const { GraphQLError } = require('graphql')

const invitationsModel = require('../models/invitations.model')
const groupsModel = require('../models/groups.model')
const usersModel = require('../models/users.model')
const { checkUser, checkUserOwnsGroup } = require('../utils/checkUser')
const logger = require('../utils/logger')

const pubsub = new PubSub()

module.exports = {
  Query: {
    getReceivedInvitations: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        const invitationInfo = await invitationsModel.getReceivedInvitations(
          currentUser.id
        )
        return invitationInfo
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
    getSentInvitations: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')

        const invitationInfo = await invitationsModel.getSentInvitations(
          currentUser.id
        )
        return invitationInfo
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
  },
  Invitation: {
    group: async (parent) => {
      const group = await groupsModel.findGroup(parent.groupId)
      return { id: group.id, name: group.name, ownerId: group.ownerId }
    },
    fromUser: async (parent) => {
      const user = await usersModel.findUserWithId(parent.fromUserId)
      return { id: user.id, username: user.username, name: user.name }
    },
    toUser: async (parent) => {
      const user = await usersModel.findUserWithId(parent.toUserId)
      return { id: user.id, username: user.username, name: user.name }
    },
  },

  Mutation: {
    createInvitation: async (root, args, { currentUser }) => {
      try {
        const {
          invitation: { toUser, groupId },
        } = args

        checkUser(currentUser, 'not authorized')

        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new Error('No permission to add invitation to a group')
        }

        const invitation = await invitationsModel.createInvitation(
          currentUser.id,
          toUser,
          groupId
        )
        if (!invitation) {
          logger.error('Create invitation failed!', invitation)
          throw new Error('Create invitation failed!')
        }
        pubsub.publish('INVITATION_ADDED', { invitationAdded: invitation })
        return invitation
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
    changeInvitationStatus: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'not authorized')
        const { id, status } = args

        const updatedInvitation = await invitationsModel.changeInvitationStatus(
          currentUser.id,
          id,
          status
        )

        pubsub.publish('INVITATION_STATUS_CHANGED', {
          invitationStatusChanged: {
            ...updatedInvitation,
          },
        })
        return updatedInvitation
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
  },
  Subscription: {
    invitationAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['INVITATION_ADDED']),
        (payload, variables) => {
          return payload.invitationAdded.toUserId === variables.toUserId
        }
      ),
    },
    invitationStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['INVITATION_STATUS_CHANGED']),
        (payload, variables) => {
          return (
            payload.invitationStatusChanged.toUserId === variables.userId ||
            payload.invitationStatusChanged.fromUserId === variables.userId
          )
        }
      ),
    },
  },
}
