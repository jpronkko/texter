const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const invitationsModel = require('../models/invitations.model')
const logger = require('../utils/logger')

const { checkUser, checkUserOwnsGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    allInvitations: async () => await invitationsModel.getAllInvitations(),
    getReceivedInvitations: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting recv. invitations failed!')
      const invitations = await invitationsModel.getInvitations(currentUser.id, false)
      return invitations
    },
    getSentInvitations: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting sent invitations failed!')
      const invitations = await invitationsModel.getInvitations(currentUser.id, true)
      return invitations
    },
  },
  Mutation: {
    createInvitation: async (root, args, { currentUser }) => {
      const { invitation: { groupId, fromUser, toUser } } = args
      checkUser(currentUser, 'Creating invitation failed!')

      if (currentUser.id !== fromUser) {
        throw new GraphQLError('Maligned input')
      }

      try {
        if(!checkUserOwnsGroup(currentUser, groupId)) {
          throw new GraphQLError('No permission to add invitation to a group')
        }

        const invitation = await invitationsModel
          .createInvitation(
            fromUser,
            toUser,
            groupId
          )
        if(!invitation) {
          logger.error('Create invitation failed!', invitation)
          throw new GraphQLError( 'Username taken', { extensions: { code: 'USERNAME_TAKEN' } })
        }
        pubsub.publish('INVITATION_ADDED', { invitationAdded: invitation })
        return invitation
      } catch(error) {
        throw new GraphQLError(`Create invitation failed: ${error.message}`)
      }
    },
    changeInvitationStatus: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Change invitation status failed!')

      const { id, status } = args
      const updatedInvitation =
        await invitationsModel
          .changeInvitationStatus(
            currentUser.id,
            id,
            status
          )

      pubsub.publish('INVITATION_STATUS_CHANGED', {
        invitationStatusChanged: {
          userId: currentUser.id,
          invitationId: id,
        }
      })
      return updatedInvitation
    },
  },
  Subscription: {
    invitationAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['INVITATION_ADDED']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.invitationAdded.userId === variables.userId
        }
      )
    },
    invitationStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['INVITATION_STATUS_CHANGED']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.invitationStatusChanged.userId === variables.userId
        }
      )
    }
  }
}