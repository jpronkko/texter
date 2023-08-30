const { startServer, stopServer } = require('../server')

const {
  createTestUser,
  createGroup,
  resetDatabases,
  //test_user,
} = require('../utils/testHelpers')

const Group = require('../models/groups.mongo')

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
    // Create test users
    userData  = await createTestUser()
  })

  it('create group with existing userId, non-existing group', async () => {
    const groupData = await createGroup('test_group', userData.token)
    console.debug('token', userData.token, 'resp:', groupData)
    expect(groupData).toBeDefined()
    expect(groupData.name).toEqual('test_group')

    const groupId = groupData.id
    const groupInDb = await Group.findById(groupId)
    expect(groupInDb).toBeDefined()
    console.log(groupInDb)
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
