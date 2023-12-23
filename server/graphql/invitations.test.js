const { startServer, stopServer } = require('../server')

const {
  url,
  gqlToServer,
  createTestUser,
  createUser,
  createGroup,
  resetDatabases,
  createInvitation,
  testUser2,
} = require('../utils/testHelpers')

const { findInvitationById } = require('../models/invitations.model')

describe('invitations test', () => {
  let httpServer, apolloServer, userData1, userData2, groupData

  beforeAll(async () => {
    const server = await startServer()
    httpServer = server.httpServer
    apolloServer = server.apolloServer
  })

  afterAll(async () => {
    await stopServer(httpServer, apolloServer)
  })

  beforeEach(async () => {
    // Empty the test db
    await resetDatabases()
    // Create test user for all the tests
    userData1 = await createTestUser()

    userData2 = await createUser(
      testUser2.name + '2',
      testUser2.username + '2',
      testUser2.email,
      testUser2.password
    )
    groupData = await createGroup(
      'test_group',
      'test description',
      userData1.token
    )
  })

  it('create invitation with existing userId, existing group', async () => {
    const invitation = await createInvitation(
      groupData.id,
      userData1.userId,
      userData2.username,
      userData1.token
    )

    expect(invitation.group.id).toEqual(groupData.id)
    expect(invitation.fromUser.id).toEqual(userData1.userId)
    expect(invitation.toUser.id).toEqual(userData2.userId)
    expect(invitation.status).toEqual('PENDING')

    const invitationInDb = await findInvitationById(invitation.id)
    expect(invitationInDb.groupId).toEqual(groupData.id)
    expect(invitationInDb.fromUserId).toEqual(userData1.userId)
    expect(invitationInDb.toUserId).toEqual(userData2.userId)
    expect(invitationInDb.status).toEqual('PENDING')
  })

  it('create duplicate invitation, not works', async () => {
    await createInvitation(
      groupData.id,
      userData1.userId,
      userData2.username,
      userData1.token
    )

    const invitation2 = await createInvitation(
      groupData.id,
      userData1.userId,
      userData2.username,
      userData1.token
    )
    expect(invitation2).toBeNull()
  })

  it('getSentInvitations returns sent invitation for a user', async () => {
    await createInvitation(
      groupData.id,
      userData1.userId,
      userData2.username,
      userData1.token
    )

    const query = `query SentInvitations {
        getSentInvitations {
          id
          group {
            id
            name
          }
          fromUser {
            id
            username
            name
          }
          toUser {
            id
            username
            name
          }
          status
          sentTime
        }
      }`

    const result = await gqlToServer(url, query, userData1.token)
    const invitation = result.body?.data?.getSentInvitations[0]

    expect(invitation).toBeDefined()
    expect(invitation.group.id).toEqual(groupData.id)
    expect(invitation.fromUser.id).toEqual(userData1.userId)
    expect(invitation.toUser.id).toEqual(userData2.userId)
    expect(invitation.status).toEqual('PENDING')
  })

  it('getReceivedInvitations returns sent invitation to a user', async () => {
    await createInvitation(
      groupData.id,
      userData1.userId,
      userData2.username,
      userData1.token
    )

    const query = `query ReceivedInvitations {
      getReceivedInvitations {
        id
        group {
          id
          name
        }
        fromUser {
          id
          username
          name
        }
        toUser {
          id
          username
          name
        }
        status
        sentTime
      }
    }`

    const result = await gqlToServer(url, query, userData2.token)
    const invitation = result.body?.data?.getReceivedInvitations[0]

    expect(invitation).toBeDefined()
    expect(invitation.group.id).toEqual(groupData.id)
    expect(invitation.fromUser.id).toEqual(userData1.userId)
    expect(invitation.toUser.id).toEqual(userData2.userId)
    expect(invitation.status).toEqual('PENDING')
  })

  it('invitation status can be changed correctly', async () => {
    const invitation = await createInvitation(
      groupData.id,
      userData1.userId,
      userData2.username,
      userData1.token
    )
    expect(invitation.status).toEqual('PENDING')

    const query = `mutation ChangeInvitationStatus {
        changeInvitationStatus(id: "${invitation.id}" status: ACCEPTED ) {
          id
          group {
            id
            name
          }
          fromUser {
            id
            username
            name
          }
          toUser {
            id
            username
            name
          }
          status
          sentTime
        }
      }`

    await gqlToServer(url, query, userData2.token)

    const query2 = `query ReceivedInvitations {
        getReceivedInvitations {
          status
        }
      }`

    const result = await gqlToServer(url, query2, userData2.token)

    const recvInvitation = result.body?.data?.getReceivedInvitations[0]
    expect(recvInvitation).toBeDefined()
    expect(recvInvitation.status).toEqual('ACCEPTED')
  })
})
