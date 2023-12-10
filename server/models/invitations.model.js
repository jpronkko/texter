const { Types } = require('mongoose')

const Invitation = require('./invitations.mongo')
const User = require('./users.mongo')
const { addUserToGroup } = require('./users.model')
const logger = require('../utils/logger')

const getAllInvitations = async () => {
  const invitations = await Invitation.find({})
  console.log('all invitations', invitations)
  if (invitations.length > 0)
    return invitations.map((invitation) => invitation.toJSON())
  return []
}

const findInvitationById = async (id) => {
  const invitation = await Invitation.findById(id)
  return invitation.toJSON()
}

const getSentInvitations = async (userId) => {
  const invitations = await Invitation.find({ fromUserId: userId })
  if (!invitations) {
    throw new Error(`Invitations from user ${userId} not found!`)
  }
  return invitations.map((item) => item.toJSON())

  /*return invitations.map((item) => ({
    id: item._id.toString(),
    group: item.groupId,
    user: item.toUserId,
    status: item.status,
    sentTime: item.sentTime,
  }))*/
}

const getReceivedInvitations = async (userId) => {
  const invitations = await Invitation.find({ toUserId: userId })
  if (!invitations) {
    logger.error(`Invitations to user ${userId} not found!`)
    throw new Error(`Invitations to user ${userId} not found!`)
  }
  return invitations.map((item) => item.toJSON())
  /*return invitations.map((item) => ({
    id: item._id.toString(),
    group: item.groupId,
    user: item.fromUserId,
    status: item.status,
    sentTime: item.sentTime,
  }))*/
}

const createInvitation = async (fromUserId, toUser, groupId) => {
  console.log('trying to find username', toUser)
  const userToInvite = await User.findOne({ username: toUser })
  if (!userToInvite) {
    throw new Error('User to invite not found!')
  }

  const isInGroup = userToInvite.joinedGroups.find(
    (item) => item.group.toString() === groupId
  )
  if (isInGroup) {
    logger.error('User is already in group!')
    throw new Error('User is already in group!')
  }

  const toUserId = userToInvite._id
  const invitations = await Invitation.find({
    fromUserId: new Types.ObjectId(fromUserId),
    toUserId: new Types.ObjectId(toUserId),
    groupId: new Types.ObjectId(groupId),
  })

  logger.info('Invitations', invitations)

  if (invitations && invitations.length > 0) {
    logger.error(
      'There is already a pending or rejected invitation!',
      fromUserId,
      toUserId,
      groupId
    )
    throw new Error(`There is already an invitation! ${invitations}`)
  }
  const newInvitation = new Invitation({
    groupId,
    fromUserId,
    toUserId,
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

  const invitationJSON = invitation.toJSON()

  if (invitationJSON.status === status) {
    logger.info(`Changing invitation status, but it as already ${status}.`)
    return invitationJSON
  }

  if (status === 'ACCEPTED') {
    if (invitationJSON.toUserId !== userId) {
      logger.error(
        'Not authorizded to accept invitation!',
        'to user',
        invitation.toUserId,
        'current user',
        userId
      )
      throw new Error('Not authorized to accept invitation!')
    }

    const groupId = await addUserToGroup(
      invitationJSON.toUserId,
      invitationJSON.groupId,
      'MEMBER'
    )
    if (!groupId) {
      logger.error('No user group found!')
      throw new Error('No user group found!')
    }

    await Invitation.deleteOne({ _id: invitation._id })
    return invitationJSON
  } else if (status === 'REJECTED') {
    if (invitationJSON.toUserId !== userId) {
      logger.error(
        'Not authorizded to reject invitation!',
        'to user',
        invitation.toUserId,
        'current user',
        userId
      )
      throw new Error('Not authorized to reject invitation!')
    }
    await Invitation.deleteOne({ _id: invitationId })
    return invitationJSON
  } else if (status === 'CANCELLED') {
    if (invitationJSON.fromUserId !== userId) {
      logger.error(
        'Not authorizded to cancel invitation!',
        'from user',
        invitation.fromUserId,
        'current user',
        userId
      )
      throw new Error('Not authorized to cancel invitation!')
    }
    await Invitation.deleteOne({ _id: invitation._id })
    return invitationJSON
  }

  invitation.status = status
  return (await invitation.save()).toJSON()
}

module.exports = {
  getAllInvitations,
  getReceivedInvitations,
  getSentInvitations,
  findInvitationById,
  createInvitation,
  changeInvitationStatus,
}
