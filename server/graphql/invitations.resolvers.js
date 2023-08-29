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
      console.log('Invitations', invitations)
      return invitations
    },
    getSentInvitations: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting sent invitations failed!')
      const invitations = await invitationsModel.getInvitations(currentUser.id, true)
      console.log('Invitations', invitations)
      return invitations
    },
  },
  Mutation: {
    createInvitation: async (root, args, { currentUser }) => {
      logger.info('UserInput', args)
      const { invitation: { groupId, fromUser, toUser } } = args
      checkUser(currentUser, 'Creating invitation failed!')

      if (currentUser.id !== fromUser) {
        throw new GraphQLError('Maligned input')
      }

      if(!checkUserOwnsGroup(currentUser, groupId)) {
        throw new GraphQLError('No permission to add invitation to a group')
      }

      const invitation = await invitationsModel.createInvitation(fromUser, toUser, groupId)
      if(!invitation) {
        logger.error('Create invitation failed!', invitation)
        throw new GraphQLError( 'Username taken', { extensions: { code: 'USERNAME_TAKEN' } })
      }

      pubsub.publish('INVITATION_ADDED', { invitationAdded: invitation })
      return invitation
    },
    changeInvitationStatus: async (root, args, { currentUser }) => {
      logger.info(`Adding user ${args.userId} to group ${args.groupId}`)

      checkUser(currentUser, 'Adding a user to a group failed!')

      const { invitationId, status } = args
      const updatedInvitation =
        await invitationsModel
          .changeInvitationStatus(
            currentUser.id,
            invitationId,
            status
          )

      logger.info('Updated user', updatedInvitation)
      pubsub.publish('INVITATION_STATUS_CHANGED', {
        invitationStatusChanged: {
          userId: currentUser.id,
          invitationId,
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