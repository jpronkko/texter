const logger = require('../utils/logger')

const Invitation = require('./invitations.mongo')
const { addUserToGroup } = require('./users.model')

const getInvitations = async (userId, isFromUser) => {
  logger.info('UserID', userId, isFromUser)
  if (isFromUser)
    return await Invitation.find({ fromUser: userId })

  return await Invitation.find({ toUser: userId })
}

const createInvitation = async (fromUser, toUser, groupId) => {
  const invitation = new Invitation({ fromUser, toUser, groupId, sentTime: Date.now() })
  return await invitation.save()
}

const changeInvitationStatus = async (userId, invitationId, status) => {
  const invitation = Invitation.findById(invitationId)
  if (invitation.status === status)
    return
  if (status === 'accepted') {
    await addUserToGroup(invitation.toUser, invitation.groupId)
  }
  invitation.status = status
  return await invitation.save()
}

module.exports = {
  getInvitations,
  createInvitation,
  changeInvitationStatus,
}