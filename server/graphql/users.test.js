//const request = require('supertest')
const { startServer, stopServer } = require('../server')
const testUsers = require('../utils/testUsers')
const {
  url,
  gqlToServer,
  createUser,
  createTestUser,
  createGroup,
  createTestUsers,
  login,
  loginTestUser,
  resetDatabases,
  testUser,
  testUser2,
} = require('../utils/testHelpers')

const {
  findUser,
  addUserToGroup,
  findUserWithId,
} = require('../models/users.model')

const allUsers = 'query AllUsers { allUsers { name, username, email }}'

describe('user test', () => {
  let httpServer, apolloServer

  beforeAll(async () => {
    ;({ httpServer, apolloServer } = await startServer())
  })

  afterAll(async () => {
    await stopServer(httpServer, apolloServer)
  })

  beforeEach(async () => {
    // Empty users from the test db
    await resetDatabases()
  })

  it('create user works with appropriate input', async () => {
    const userData = await createTestUser()
    // Checking for the correct response
    expect(userData).toBeDefined()
    expect(userData.user.username).toEqual(testUser.username)
    expect(userData.user.name).toEqual(testUser.name)

    // Checking for the database entry
    const user = await findUser(testUser.username)
    expect(user.id).toEqual(userData.user.id)
    expect(user.name).toEqual(testUser.name)
    expect(user.username).toEqual(testUser.username)
  })

  it('create user with duplicate username does not work', async () => {
    await createTestUser()

    const response = await createUser(
      testUser.name + '2',
      testUser.username,
      '2' + testUser.email,
      testUser.password
    )
    expect(response).toBeNull()
  })

  it('create user with duplicate e-mail does not work', async () => {
    await createTestUser()

    const response = await createUser(
      testUser.name + '2',
      testUser.username + '2',
      testUser.email,
      testUser.password
    )
    expect(response).toBeNull()
  })

  it('create user with incorrect e-mail does not work', async () => {
    const response = await createUser(
      testUser.name,
      testUser.username,
      'popppooo',
      testUser.password
    )
    expect(response).toBeNull()
  })

  it('creation of multiple test users works', async () => {
    await createTestUsers()

    const response = await gqlToServer(url, allUsers)
    const returnedUsers = response.body.data.allUsers
    const expectedUsers = testUsers.map((u) => ({
      username: u.username,
      name: u.name,
      email: u.email,
    }))

    expect(expectedUsers).toEqual(expect.arrayContaining(returnedUsers))
  })

  it('login with correct credentials works', async () => {
    await createTestUser()

    const loginResponse = await loginTestUser()
    expect(loginResponse).toBeDefined()
    expect(loginResponse.token).toBeDefined()
    expect(loginResponse.user.username).toEqual(testUser.username)
    expect(loginResponse.user.email).toEqual(testUser.email)
    expect(loginResponse.user.name).toEqual(testUser.name)
    expect(loginResponse.user.groups).toHaveLength(0)
    expect(loginResponse.user.password).not.toBeDefined()
  })

  it('login with incorrect password does not work', async () => {
    await createTestUser()

    const loginData = await login(testUser.username, 'kukkuluuruu')
    expect(loginData).toBeNull()
  })

  it('login with non existent account does not work', async () => {
    const loginData = await login(testUser.username, testUser.password)
    expect(loginData).toBeNull()
  })

  it('login gives correct group data', async () => {
    const userData1 = await createTestUser()
    const groupData = await createGroup('testGroup', userData1.token)
    console.log('group data', groupData)
    const loginResponse = await loginTestUser()
    expect(loginResponse).toBeDefined()

    const loginGroupData = loginResponse.user.groups[0]
    expect(loginGroupData.role).toEqual('OWNER')
    expect(loginGroupData.group.id).toEqual(groupData.id)
    expect(loginGroupData.group.name).toEqual(groupData.name)
  })

  it('user group role change works with correct parameters', async () => {
    const userData1 = await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    const groupData = await createGroup('testGroup', userData1.token)
    expect(groupData).toBeDefined()

    await addUserToGroup(userData2.user.id, groupData.id, 'MEMBER')
    const query = `mutation UpdateUserRole {
       updateUserRole(userId: "${userData2.user.id}" groupId: "${groupData.id}" role: ADMIN) {
         id
         groups {
          role
         }
       }
     }`

    const result = await gqlToServer(url, query, userData1.token)
    const updatedUser = result.body.data.updateUserRole

    expect(updatedUser.id).toEqual(userData2.user.id)
    expect(updatedUser.groups[0].role).toEqual('ADMIN')

    const userInDb = await findUserWithId(userData2.user.id)
    expect(userInDb.groups[0].role).toEqual('ADMIN')
  })

  it('user group role change does not work with incorrect role', async () => {
    const userData1 = await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    const groupData = await createGroup('testGroup', userData1.token)
    expect(groupData).toBeDefined()

    await addUserToGroup(userData2.user.id, groupData.id, 'MEMBER')
    const query = `mutation UpdateUserRole {
       updateUserRole(userId: "${userData2.user.id}" groupId: "${groupData.id}" role: KEMBER) {
         id
         groups {
          role
         }
       }
     }`

    const result = await gqlToServer(url, query, userData1.token)
    console.log(result.body)
    expect(result.body.errors).toBeDefined()
  })
})
