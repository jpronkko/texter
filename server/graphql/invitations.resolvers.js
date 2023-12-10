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
    allInvitations: async () => await invitationsModel.getAllInvitations(),
    getReceivedInvitations: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Getting recv. invitations failed!')

        const invitationInfo = await invitationsModel.getReceivedInvitations(
          currentUser.id
        )
        return invitationInfo
      } catch (error) {
        throw new GraphQLError(
          `Get received invitations failed: ${error.message}`
        )
      }
    },
    getSentInvitations: async (root, args, { currentUser }) => {
      try {
        checkUser(currentUser, 'Getting sent invitations failed!')

        const invitationInfo = await invitationsModel.getSentInvitations(
          currentUser.id
        )
        return invitationInfo
      } catch (error) {
        throw new GraphQLError(`Get sent invitations failed: ${error.message}`)
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
      const {
        invitation: { toUser, groupId },
      } = args
      checkUser(currentUser, 'Creating invitation failed!')

      try {
        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new GraphQLError('No permission to add invitation to a group')
        }

        const invitation = await invitationsModel.createInvitation(
          currentUser.id,
          toUser,
          groupId
        )
        if (!invitation) {
          logger.error('Create invitation failed!', invitation)
          throw new GraphQLError('Create invitation failed!', {
            extensions: { code: 'CREATE_INVITATION_FAILED' },
          })
        }
        pubsub.publish('INVITATION_ADDED', { invitationAdded: invitation })
        return invitation
      } catch (error) {
        throw new GraphQLError(`Create invitation failed: ${error.message}`)
      }
    },
    changeInvitationStatus: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Change invitation status failed!')

      const { id, status } = args

      try {
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
        throw new GraphQLError(
          `Change invitation status failed: ${error.message}`
        )
      }
    },
  },
  Subscription: {
    invitationAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['INVITATION_ADDED']),
        (payload, variables) => {
          console.log('invitation added payload', payload)
          return payload.invitationAdded.userId === variables.userId
        }
      ),
    },
    invitationStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['INVITATION_STATUS_CHANGED']),
        (payload, variables) => {
          console.log('invitation status changed payload', payload)
          return payload.invitationStatusChanged.userId === variables.userId
        }
      ),
    },
  },
}
