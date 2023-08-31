const { startServer, stopServer } = require('../server')

const {
  createTestUser,
  createGroup,
  resetDatabases,
  //test_user,
} = require('../utils/testHelpers')

const { findGroup } = require('../models/groups.model')
const { findUserWithId } = require('../models/users.model')

describe('groups test', () => {
  let httpServer, apolloServer, userData

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
    userData = await createTestUser()
  })

  it('create group with existing userId, non-existing group', async () => {
    const groupData = await createGroup('test_group', userData.token)
    expect(groupData).toBeDefined()
    expect(groupData.name).toEqual('test_group')

    const groupId = groupData.id
    const groupInDb = await findGroup(groupId)
    expect(groupInDb).toBeDefined()

    const savedUser = await findUserWithId(userData.user.id)
    expect(savedUser.ownedGroups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: groupId
        })
      ])
    )
  })

  it('create group with existing userId, existing group', async () => {
    const groupData = await createGroup('test_group', userData.token)
    expect(groupData).toBeDefined()
    expect(groupData.name).toEqual('test_group')

    const newGroupData = await createGroup('test_group', userData.token)
    expect(newGroupData).toBeNull()
  })

  it('create group with malformed token, not succeeding', async () => {
    const groupData = await createGroup('test_group', 'puupaa')
    expect(groupData).toBeUndefined()
  })
})
