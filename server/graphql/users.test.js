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
  addUserToGroup,
  getUser,
  login,
  loginTestUser,
  resetDatabases,
  testUser,
  testUser2,
} = require('../utils/testHelpers')

const {
  findUser,
  //addUserToGroup,
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
    expect(userData.username).toEqual(testUser.username)
    expect(userData.name).toEqual(testUser.name)

    // Checking for the database entry
    const user = await findUser(testUser.username)
    console.log('user', user)
    expect(user.id).toEqual(userData.userId)
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
    expect(loginResponse.username).toEqual(testUser.username)
    expect(loginResponse.email).toEqual(testUser.email)
    expect(loginResponse.name).toEqual(testUser.name)
    expect(loginResponse.password).not.toBeDefined()
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
    const userData = await createTestUser()
    console.log('userdata', userData)

    const loginResponse = await loginTestUser()
    console.log('login response', loginResponse)
    expect(loginResponse).toBeDefined()

    const groupData = await createGroup('testGroup', loginResponse.token)
    console.log('group data', groupData)

    const query = `query GetUserJoinedGroups {
      getUserJoinedGroups {
        role
        group {
          id
          name
        }
      }
    }`

    const result = await gqlToServer(url, query, loginResponse.token)
    console.log(result.body)

    const joinedData = result.body.data.getUserJoinedGroups[0]
    expect(joinedData.role).toEqual('OWNER')
    expect(joinedData.group.id).toEqual(groupData.id)
    expect(joinedData.group.name).toEqual(groupData.name)
  })

  it('add user to a group works', async () => {
    /*const userData1 =*/ await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    console.log('userdata2', userData2)
    const loginData = await loginTestUser()
    const groupData = await createGroup('testGroup', loginData.token)
    const userGroupRole = await addUserToGroup(
      userData2.userId,
      groupData.id,
      loginData.token,
      'MEMBER'
    )
    console.log('Response', userGroupRole)
    expect(userGroupRole.user).toEqual(userData2.userId)
    expect(userGroupRole.group).toEqual(groupData.id)
    expect(userGroupRole.role).toEqual('MEMBER')
    const user = await getUser(testUser2.username)
    console.log('User', user)
    expect(user.groups[0].group.id).toEqual(groupData.id)
    expect(user.groups[0].role).toEqual('MEMBER')
  })

  it('user group role change works with correct parameters', async () => {
    const userData1 = await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    console.log('--------- Initial data ----------------------')
    console.log(userData1)
    console.log(userData2)
    console.log('--------------------------------')

    const groupData = await createGroup('testGroup', userData1.token)
    expect(groupData).toBeDefined()

    console.log('---- add user to group ---')
    const group = await addUserToGroup(
      userData2.userId,
      groupData.id,
      userData1.token,
      'MEMBER'
    )
    console.log('---- ! add user to group ---', group)

    const query = `mutation UpdateUserRole {
       updateUserRole(userId: "${userData2.userId}" groupId: "${groupData.id}" role: ADMIN) {
          user
          group
          role
       }
     }`

    const result = await gqlToServer(url, query, userData1.token)
    const userGroupRole = result.body.data.updateUserRole
    console.log('---- user group role ----', userGroupRole)

    expect(userGroupRole.user).toEqual(userData2.userId)
    expect(userGroupRole.group).toEqual(groupData.id)
    expect(userGroupRole.role).toEqual('ADMIN')

    const userInDb = await findUserWithId(userData2.userId)
    console.log('user in db', userInDb)
    expect(userInDb.groups[0].group).toEqual(groupData.id)
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

    await addUserToGroup(
      userData2.userId,
      groupData.id,
      userData1.token,
      'MEMBER'
    )
    const query = `mutation UpdateUserRole {
       updateUserRole(userId: "${userData2.userId}" groupId: "${groupData.id}" role: KEMBER) {
          user
          group
          role
       }
     }`

    const result = await gqlToServer(url, query, userData1.token)
    console.log(result.body)
    expect(result.body.errors).toBeDefined()
  })
})
