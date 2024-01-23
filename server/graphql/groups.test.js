const { startServer, stopServer } = require('../server')

const {
  url,
  createTestUser,
  createGroup,
  gqlToServer,
  resetDatabases,
} = require('../utils/testHelpers')

const { findGroup } = require('../models/groups.model')
const { findUserWithId } = require('../models/users.model')

const testGroupName = 'testGroup'

describe('groups tests', () => {
  let httpServer, apolloServer, userData

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
    userData = await createTestUser()
  })

  it('create group with existing userId, non-existing group', async () => {
    const groupData = await createGroup(
      testGroupName,
      'test description',
      userData.token
    )

    // Check the returned group values match the input
    expect(groupData.name).toEqual(testGroupName)
    expect(groupData.description).toEqual('test description')

    // Check that the group is in the db
    const groupId = groupData.id
    const groupInDb = await findGroup(groupId)
    expect(groupInDb.name).toEqual(testGroupName)
    expect(groupInDb.description).toEqual('test description')

    // Check that the user has the group in the joinedGroups
    const savedUser = await findUserWithId(userData.userId)
    const joinedGroups = savedUser.joinedGroups

    expect(joinedGroups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          group: groupId, //expect.objectContaining({ id: groupId }),
          role: 'OWNER',
        }),
      ])
    )
  })

  it('create group with existing userId, existing group', async () => {
    const groupData = await createGroup(
      testGroupName,
      'test description',
      userData.token
    )
    expect(groupData).toBeDefined()
    expect(groupData.name).toEqual(testGroupName)

    const newGroupData = await createGroup(testGroupName, userData.token)
    expect(newGroupData).toBeNull()
  })

  it('create group with malformed token, not succeeding', async () => {
    const groupData = await createGroup(
      testGroupName,
      'test description',
      'puupaa'
    )
    expect(groupData).toBeNull()
  })

  it('modify group works', async () => {
    const groupData = await createGroup(
      testGroupName,
      'test description',
      userData.token
    )
    expect(groupData).toBeDefined()
    expect(groupData.name).toEqual(testGroupName)

    const newGroupName = 'newGroupName'
    const newDescription = 'newDescription'

    const query = `mutation ModifyGroup {
      modifyGroup(
        groupId: "${groupData.id}",
        name: "${newGroupName}",
        description: "${newDescription}"
      ) {
        id
        name
        description
      }
    }`

    const response = await gqlToServer(url, query, userData.token)
    const result = response.body.data.modifyGroup

    expect(result.name).toEqual(newGroupName)
    expect(result.description).toEqual(newDescription)
  })
})
