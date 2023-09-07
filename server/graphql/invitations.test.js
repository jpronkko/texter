const { startServer, stopServer } = require('../server')

const {
  url,
  gqlToServer,
  createTestUser,
  createUser,
  createGroup,
  resetDatabases,
  createInvitation,
  testUser,
} = require('../utils/testHelpers')

const { findInvitationById } = require('../models/invitations.model')

describe('invitations test', () => {
  let httpServer, apolloServer, userData1, userData2, groupData

  beforeAll(async () => {
    ({ httpServer, apolloServer } = await startServer())
  })

  afterAll(async () => {
    await stopServer(httpServer, apolloServer)
  })

  beforeEach(async () => {
    // Empty the test db
    await resetDatabases()
    // Create test user for all the tests
    userData1  = await createTestUser()

    userData2 = await createUser(
      testUser.name + '2',
      testUser.username + '2',
      '2' + testUser.email,
      testUser.password
    )
    groupData = await createGroup('test_group', userData1.token)
  })

  /*it('create invitation with existing userId, existing group', async () => {
    const invitation = await createInvitation(
      groupData.id,
      userData1.user.id,
      userData2.user.id,
      userData1.token
    )

    expect(invitation).toBeDefined()
    expect(invitation.groupId).toEqual(groupData.id)
    expect(invitation.fromUser).toEqual(userData1.user.id)
    expect(invitation.toUser).toEqual(userData2.user.id)
    expect(invitation.status).toEqual('PENDING')

    const invitationInDb = await findInvitationById(invitation.id)
    console.log('inv in db', invitationInDb)
    console.log('group data', groupData)
    expect(invitationInDb.groupId).toEqual(groupData.id)
    expect(invitationInDb.fromUser).toEqual(userData1.user.id)
    expect(invitationInDb.toUser).toEqual(userData2.user.id)
    expect(invitationInDb.status).toEqual('PENDING')
  })

  it('create duplicate invitation, not works', async () => {
    await createInvitation(
      groupData.id,
      userData1.user.id,
      userData2.user.id,
      userData1.token
    )

    const invitation2 = await createInvitation(
      groupData.id,
      userData1.user.id,
      userData2.user.id,
      userData1.token
    )
    expect(invitation2).toBeNull()
  })
  */
  it('getSentInvitations returns sent invitation for a user', async () => {
    await createInvitation(
      groupData.id,
      userData1.user.id,
      userData2.user.id,
      userData1.token
    )

    const query =
     `query SentInvitations {
        getSentInvitations(fromUserId: "${userData1.user.id}"){
          id
          groupId
          fromUser
          toUser
          status
          sentTime
        }
      }`

    const result = await gqlToServer(url, query, userData1.token)
    console.log('RESULT body', result.body)

    const invitation = result.body?.data?.getSentInvitations[0]

    expect(invitation).toBeDefined()
    expect(invitation.groupId).toEqual(groupData.id)
    expect(invitation.fromUser).toEqual(userData1.user.id)
    expect(invitation.toUser).toEqual(userData2.user.id)
    expect(invitation.status).toEqual('PENDING')
  })

  /*it('getReceivedInvitations returns sent invitation to a user', async () => {
    await createInvitation(
      groupData.id,
      userData1.user.id,
      userData2.user.id,
      userData1.token
    )

    const query =
     `query ReceivedInvitations {
        getReceivedInvitations {
          id
          groupId
          fromUser
          toUser
          status
          sentTime
        }
      }`

    const result = await gqlToServer(url, query, userData2.token)

    const invitation = result.body?.data?.getReceivedInvitations[0]
    expect(invitation).toBeDefined()
    expect(invitation.groupId).toEqual(groupData.id)
    expect(invitation.fromUser).toEqual(userData1.user.id)
    expect(invitation.toUser).toEqual(userData2.user.id)
    expect(invitation.status).toEqual('PENDING')
  })

  it('invitation status can be changed correctly', async () => {
    const invitation = await createInvitation(
      groupData.id,
      userData1.user.id,
      userData2.user.id,
      userData1.token
    )
    expect(invitation.status).toEqual('PENDING')

    const query =
     `mutation ChangeInvitationStatus {
        changeInvitationStatus(id: "${invitation.id}" status: ACCEPTED ) {
          id
          groupId
          fromUser
          toUser
          status
          sentTime
        }
      }`

    await gqlToServer(url, query, userData2.token)

    const query2 =
     `query ReceivedInvitations {
        getReceivedInvitations {
          status
        }
      }`

    const result = await gqlToServer(url, query2, userData2.token)

    const recvInvitation = result.body?.data?.getReceivedInvitations[0]
    expect(recvInvitation).toBeDefined()
    expect(recvInvitation.status).toEqual('ACCEPTED')
  })*/
})
