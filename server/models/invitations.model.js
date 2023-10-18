const logger = require('../utils/logger')

const Invitation = require('./invitations.mongo')
const { addUserToGroup } = require('./users.model')

const getAllInvitations = async () => {
  const invitations = await Invitation.find({})
  console.log('all invitations', invitations)
  if (invitations.length > 0) return invitations.toJSON()
  return []
}

const findInvitationById = async (id) => {
  const invitation = await Invitation.findById(id)
  return invitation.toJSON()
}

const getInvitations = async (userId, isFromUser) => {
  if (isFromUser) {
    const invitation = await Invitation.find({ fromUser: userId })
    if (!invitation) {
      throw new Error(`Invitations from user ${userId} not found!`)
    }
    return invitation.map((item) => item.toJSON())
  }

  const invitations = await Invitation.find({ toUser: userId })
  if (!invitations) {
    throw new Error(`Invitations to user ${userId} not found!`)
  }
  return invitations.map((item) => item.toJSON())
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

  const invitation2 = invitation.toJSON()

  if (invitation2.status === status) {
    logger.info(`Changing invitation status, but it as already ${status}.`)
    return
  }

  if (status === 'ACCEPTED') {
    if (invitation2.toUser !== userId) {
      logger.error(
        'Not authorizded to accept invitation!',
        invitation.toUser,
        userId
      )
      throw new Error('Not authorized to accept invitation!')
    }

    const groupId = await addUserToGroup(
      invitation2.toUser,
      invitation2.groupId,
      'MEMBER'
    )
    if (!groupId) {
      logger.error('No user group found!')
      return null
    }
  }

  invitation.status = status
  return (await invitation.save()).toJSON()
}

module.exports = {
  getAllInvitations,
  getInvitations,
  findInvitationById,
  createInvitation,
  changeInvitationStatus,
}
