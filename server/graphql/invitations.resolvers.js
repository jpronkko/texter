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
      const invitationInfo = await invitationsModel.getReceivedInvitations(
        currentUser.id
      )
      console.log('Invitaiton Info', invitationInfo)
      return invitationInfo
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
  InvitationInfo: {
    group: async (parent) => {
      console.log('group args', parent)
      const group = await groupsModel.findGroup(parent.group)
      console.log('group', group)
      //return group
      return { id: group.id, name: group.name, ownerId: group.ownerId }
    },
    user: async (parent) => {
      console.log('user args', parent)
      const user = await usersModel.findUserWithId(parent.user)
      console.log('user', user)
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
          'Prep creazte. Creating invitation',
          currentUser.id,
          toUser,
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
          userId: currentUser.id,
          invitationId: id,
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
