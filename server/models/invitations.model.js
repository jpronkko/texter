const logger = require('../utils/logger')

const Invitation = require('./invitations.mongo')
const { addUserToGroup } = require('./users.model')

const getAllInvitations = async () => {
  return await Invitation.find({})
}

const getInvitations = async (userId, isFromUser) => {
  logger.info('UserID', userId, isFromUser)
  if (isFromUser)
    return await Invitation.find({ fromUser: userId })

  return await Invitation.find({ toUser: userId })
}

const createInvitation = async (fromUser, toUser, groupId) => {
  const invitatiton = await Invitation.findOne({ fromUser, toUser })

  if (invitatiton) {
    throw new Error('There is already an invitation!')
  }
  const newInvitation = new Invitation({
    groupId,
    fromUser,
    toUser,
    status: 'PENDING',
    sentTime: Date.now(),
  })
  return await newInvitation.save()
}

const changeInvitationStatus = async (userId, invitationId, status) => {
  const invitation = await Invitation.findById(invitationId)
  if (!invitation) {
    throw new Error('Invitation not found!')
  }
  if (invitation.status === status)
    return

  if (status === 'ACCEPTED') {
    await addUserToGroup(invitation.toUser, invitation.groupId)
  }
  invitation.status = status
  return await invitation.save()
}

module.exports = {
  getAllInvitations,
  getInvitations,
  createInvitation,
  changeInvitationStatus,
}