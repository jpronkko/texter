const logger = require('../utils/logger')

const Invitation = require('./invitations.mongo')
const { addUserToGroup } = require('./users.model')

const getAllInvitations = async () => {
  const invitations = await Invitation.find({})
  return invitations.toJSON()
}

const findInvitationById = async (id) => {
  const invitation = await Invitation.findById(id)
  return invitation.toJSON()
}

const getInvitations = async (userId, isFromUser) => {
  logger.info('UserID', userId, isFromUser)
  if (isFromUser) {
    const invitation = await Invitation.find({ fromUser: userId })
    if(!invitation) {
      throw new Error(`Invitations from user ${userId} not found!`)
    }
    console.log('Vituke', invitation, typeof(invitation))
    return invitation.map(item => item.toJSON())
  }

  const invitation = await Invitation.find({ toUser: userId })
  if(!invitation) {
    throw new Error(`Invitations to user ${userId} not found!`)
  }
  return invitation.map(item => item.toJSON())
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
  return (await newInvitation.save()).toJSON()
}

const changeInvitationStatus = async (userId, invitationId, status) => {
  const invitation = await Invitation.findById(invitationId)
  if (!invitation) {
    throw new Error('Invitation not found!')
  }
  if (invitation.status === status)
    return

  if (status === 'ACCEPTED') {
    const groupId = await addUserToGroup(invitation.toUser, invitation.groupId)
    if(!groupId)
      return null
    invitation.status = status
    return (await (invitation.save())).toJSON()
  }
  return null
}

module.exports = {
  getAllInvitations,
  getInvitations,
  findInvitationById,
  createInvitation,
  changeInvitationStatus,
}