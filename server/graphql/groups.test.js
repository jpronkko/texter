const { startServer } = require('../server')

const {
  createTestUser,
  createGroup,
  resetDatabases,
  test_user,
} = require('../utils/testHelpers')

const Group = require('../models/groups.model')

describe('groups test', () => {
  let httpServer, apolloServer, userId

  beforeAll(async () => {
    ({ httpServer, apolloServer } = await startServer())
  })

  afterAll(async () => {
    await httpServer?.close()
    await apolloServer?.stop()
  })

  beforeEach(async () => {
    // Empty the test db
    await resetDatabases()
    // Create test users
    const user = await createTestUser()
    userId = user.id
  })

  it('create group with existing userId, non-existing group', async () => {
    const response = await createGroup('test_group', userId)
    expect(response.errors).toBeUndefined()
    console.debug(response.body)
    const groupId = response.body.id
    const groupInDb =  await Group.findGroup(groupId)
    if(!groupInDb)
      console.debug('Error!')
    //expect(response.body.data?.allUsers).toContain()
  })
})
