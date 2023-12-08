const { PubSub, withFilter } = require('graphql-subscriptions')

const { GraphQLError } = require('graphql')

const invitationsModel = require('../models/invitations.model')
const groupsModel = require('../models/groups.model')
const usersModel = require('../models/users.model')

const logger = require('../utils/logger')

const { checkUser, checkUserOwnsGroup } = require('../utils/checkUser')

const pubsub = new PubSub()

module.exports = {
  Query: {
    allInvitations: async () => await invitationsModel.getAllInvitations(),
    getReceivedInvitations: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting recv. invitations failed!')
      try {
        const invitationInfo = await invitationsModel.getReceivedInvitations(
          currentUser.id
        )
        console.log('Resolver, getRecInv.. Invitation Info', invitationInfo)
        return invitationInfo
      } catch (error) {
        throw new GraphQLError(
          `Get received invitations failed: ${error.message}`
        )
      }
    },
    getSentInvitations: async (root, args, { currentUser }) => {
      checkUser(currentUser, 'Getting sent invitations failed!')

      const invitationInfo = await invitationsModel.getSentInvitations(
        currentUser.id
      )
      console.log('Invitaiton Info', invitationInfo)
      return invitationInfo
    },
  },
  Invitation: {
    group: async (parent) => {
      const group = await groupsModel.findGroup(parent.groupId)
      //return group
      return { id: group.id, name: group.name, ownerId: group.ownerId }
    },
    fromUser: async (parent) => {
      const user = await usersModel.findUserWithId(parent.fromUserId)
      return { id: user.id, username: user.username, name: user.name }
    },
    toUser: async (parent) => {
      console.log('-------------')
      console.log('Parent user args', parent)
      const user = await usersModel.findUserWithId(parent.toUserId)
      console.log('to user from foffa conversion', user)
      return { id: user.id, username: user.username, name: user.name }
    },
    /*fromUser: async (parent) => {
      console.log('user args', parent)
      const user = await usersModel.findUserWithId(parent.fromUser)
      return { id: user.id, username: user.username, name: user.name }
    },
    toUser: async (parent) => {
      console.log('user args', parent)
      const user = await usersModel.findUserWithId(parent.fromUser)
      return { id: user.id, username: user.username, name: user.name }
    },*/
  },

  Mutation: {
    createInvitation: async (root, args, { currentUser }) => {
      const {
        invitation: { toUser, groupId },
        //invitation: { fromUserId, toUser, groupId },
      } = args
      checkUser(currentUser, 'Creating invitation failed!')

      try {
        if (!checkUserOwnsGroup(currentUser, groupId)) {
          throw new GraphQLError('No permission to add invitation to a group')
        }

        console.log(
          'Prep creazte. Creating invitation current user',
          currentUser.id,
          'to user',
          toUser,
          'to grop',
          groupId
        )
        const invitation = await invitationsModel.createInvitation(
          currentUser.id,
          toUser,
          groupId
        )
        if (!invitation) {
          logger.error('Create invitation failed!', invitation)
          throw new GraphQLError('Create invitation failedf!', {
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
      ),
    },
    invitationStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['INVITATION_STATUS_CHANGED']),
        (payload, variables) => {
          console.log('payload', payload)
          return payload.invitationStatusChanged.userId === variables.userId
        }
      ),
    },
  },
}
