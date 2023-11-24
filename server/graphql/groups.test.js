const { startServer, stopServer } = require('../server')

const {
  createTestUser,
  createGroup,
  modifyGroup,
  resetDatabases,
} = require('../utils/testHelpers')

const { findGroup } = require('../models/groups.model')
const { findUserWithId } = require('../models/users.model')

const testGroupName = 'testGroup'

describe('groups tests', () => {
  let httpServer, apolloServer, userData

  beforeAll(async () => {
    ;({ httpServer, apolloServer } = await startServer())
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
    console.log('UserData from create user', userData)
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
    expect(savedUser.joinedGroups).toEqual(
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
    const newGroupData = await modifyGroup(
      groupData.id,
      newGroupName,
      newDescription,
      userData.token
    )
    expect(newGroupData).toBeDefined()
    expect(newGroupData.name).toEqual(newGroupName)
    expect(newGroupData.description).toEqual(newDescription)
  })
})
