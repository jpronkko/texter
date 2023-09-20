const { startServer, stopServer } = require('../server')

const {
  createTestUser,
  createGroup,
  resetDatabases,
} = require('../utils/testHelpers')

const { findGroup } = require('../models/groups.model')
const { findUserWithId } = require('../models/users.model')

const testGroupName = 'testGroup'

describe('groups test', () => {
  let httpServer, apolloServer, userData1

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
    userData1 = await createTestUser()
  })

  it('create group with existing userId, non-existing group', async () => {
    const groupData = await createGroup(testGroupName, userData1.token)
    expect(groupData).toBeDefined()
    expect(groupData.name).toEqual(testGroupName)

    const groupId = groupData.id
    const groupInDb = await findGroup(groupId)
    expect(groupInDb).toBeDefined()

    const savedUser = await findUserWithId(userData1.user.id)
    expect(savedUser.groups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          group: expect.objectContaining({ id: groupId }),
          role: 'OWNER'
        })
      ])
    )
  })

  it('create group with existing userId, existing group', async () => {
    const groupData = await createGroup(testGroupName, userData1.token)
    expect(groupData).toBeDefined()
    expect(groupData.name).toEqual(testGroupName)

    const newGroupData = await createGroup(testGroupName, userData1.token)
    expect(newGroupData).toBeNull()
  })

  it('create group with malformed token, not succeeding', async () => {
    const groupData = await createGroup(testGroupName, 'puupaa')
    expect(groupData).toBeUndefined()
  })
})
