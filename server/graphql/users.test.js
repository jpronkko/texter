//const request = require('supertest')
const { startServer, stopServer } = require('../server')
const {
  url,
  gqlToServer,
  createUser,
  createTestUser,
  createGroup,
  addUserToGroup,
  login,
  loginTestUser,
  resetDatabases,
  getUserJoinedGroups,
  testUser,
  testUser2,
} = require('../utils/testHelpers')

const { findUserByUsername } = require('../models/users.model')

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
    const user = await findUserByUsername(testUser.username)
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

    const loginResponse = await loginTestUser()
    expect(loginResponse).toBeDefined()

    const groupData = await createGroup(
      'testGroup',
      'test description',
      loginResponse.token
    )

    const joinedData = await getUserJoinedGroups(loginResponse.token)
    expect(joinedData.userId).toEqual(userData.userId)
    const group = joinedData.joinedGroups.find(
      (g) => g.groupId === groupData.id
    )
    expect(group.role).toEqual('OWNER')
    expect(group.groupId).toEqual(groupData.id)
    expect(group.groupName).toEqual(groupData.name)
  })

  it('change password works with correct parameters', async () => {
    const newPasswd = 'uusipasswd'
    const userData = await createTestUser()

    const query = `mutation ChangePassword {
      changePassword(oldPassword: "${testUser.password}" newPassword: "${newPasswd}") {
        id
        email
        name
        username
      } }`

    const response = await gqlToServer(url, query, userData.token)
    const result = response.body.data.changePassword

    expect(result.id).toEqual(userData.userId)
    expect(result.email).toEqual(userData.email)
    expect(result.username).toEqual(userData.username)
    expect(result.name).toEqual(userData.name)
  })

  it('change password does not work with incorrect old password', async () => {
    const newPasswd = 'uusipasswd'
    const userData = await createTestUser()

    const query = `mutation ChangePassword {
      changePassword(oldPassword: "${testUser.password}2" newPassword: "${newPasswd}") {
        id
        email
        name
        username
      } }`

    const result = await gqlToServer(url, query, userData.token)
    expect(result.body.data.changePassword).toBeNull()
    expect(result.body.errors).toBeDefined()
  })

  it('change password does not work with too short new password', async () => {
    const newPasswd = 'uus'
    const userData = await createTestUser()

    const query = `mutation ChangePassword {
      changePassword(oldPassword: "${testUser.password}" newPassword: "${newPasswd}") {
        id
        email
        name
        username
      } }`

    const result = await gqlToServer(url, query, userData.token)
    expect(result.body.data.changePassword).toBeNull()
    expect(result.body.errors).toBeDefined()
  })

  it('change email works with correct password', async () => {
    const newEmail = 'neppi@halla.com'
    const userData = await createTestUser()

    const query = `mutation ChangeEmail {
      changeEmail(password: "${testUser.password}" newEmail: "${newEmail}") {
        id
        email
        name
        username
      } }`

    const response = await gqlToServer(url, query, userData.token)
    const result = response.body.data.changeEmail

    expect(result.id).toEqual(userData.userId)
    expect(result.email).toEqual(newEmail)
    expect(result.username).toEqual(userData.username)
    expect(result.name).toEqual(userData.name)
  })

  it('change email does not work with incorrect password', async () => {
    const newEmail = 'neppi@halla.com'
    const userData = await createTestUser()
    const password = 'hilpatihalpatir'
    const query = `mutation ChangeEmail {
      changeEmail(password: "${password}" newEmail: "${newEmail}") {
        id
        email
        name
        username
      } }`

    const response = await gqlToServer(url, query, userData.token)
    expect(response.body.data.changeEmail).toBeNull()
    expect(response.error).toBeDefined()
  })

  it('add user to a group works', async () => {
    await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    const loginData = await loginTestUser()
    const groupData = await createGroup(
      'testGroup',
      'test group',
      loginData.token
    )
    const userGroupRole = await addUserToGroup(
      userData2.userId,
      groupData.id,
      loginData.token,
      'MEMBER'
    )
    expect(userGroupRole.user).toEqual(userData2.userId)
    expect(userGroupRole.group).toEqual(groupData.id)
    expect(userGroupRole.role).toEqual('MEMBER')

    const joinedData = await getUserJoinedGroups(userData2.token)

    const joinedGroup = joinedData.joinedGroups.find(
      (g) => g.groupId === groupData.id
    )
    expect(joinedGroup.groupId.toString()).toEqual(groupData.id)
    expect(joinedGroup.role).toEqual('MEMBER')
  })

  it('get user not in group works', async () => {
    const userData1 = await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    const groupData = await createGroup(
      'testGroup',
      'test group',
      userData1.token
    )

    const query = `query GetUsersNotInGroup {
      getUsersNotInGroup(groupId: "${groupData.id}") {
        id
        name
        username
        email
      }
    }`

    const response = await gqlToServer(url, query, userData1.token)
    const result = response.body.data.getUsersNotInGroup

    expect(result[0].id).toEqual(userData2.userId)
    expect(result[0].name).toEqual(userData2.name)
    expect(result[0].username).toEqual(userData2.username)
    expect(result[0].email).toEqual(userData2.email)
  })

  it('remove user from a group works', async () => {
    const userData1 = await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    const groupData = await createGroup(
      'testGroup',
      'test group',
      userData1.token
    )

    await addUserToGroup(
      userData2.userId,
      groupData.id,
      userData1.token,
      'MEMBER'
    )

    const firstJoinedData = await getUserJoinedGroups(userData2.token)
    const joinedGroup = firstJoinedData.joinedGroups.find(
      (g) => g.groupId === groupData.id
    )
    expect(joinedGroup.groupId.toString()).toEqual(groupData.id)

    const query = `mutation RemoveUserFromGroup {
      removeUserFromGroup(userId: "${userData2.userId}" groupId: "${groupData.id}") {
          user
          group
          role
        }
      }`

    await gqlToServer(url, query, userData1.token)

    const secodJoinedData = await getUserJoinedGroups(userData2.token)
    const secondJoinedGroup = secodJoinedData.joinedGroups.find(
      (g) => g.groupId === groupData.id
    )
    expect(secondJoinedGroup).toBeUndefined()
  })

  it('user group role change works with correct parameters', async () => {
    const userData1 = await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    const groupData = await createGroup(
      'testGroup',
      'test group',
      userData1.token
    )
    expect(groupData).toBeDefined()

    const group = await addUserToGroup(
      userData2.userId,
      groupData.id,
      userData1.token,
      'MEMBER'
    )
    expect(group).toBeDefined()
    const query = `mutation UpdateUserRole {
       updateUserRole(userId: "${userData2.userId}" groupId: "${groupData.id}" role: ADMIN) {
          user
          group
          role
       }
     }`

    const result = await gqlToServer(url, query, userData1.token)
    const userGroupRole = result.body.data.updateUserRole
    expect(userGroupRole.user).toEqual(userData2.userId)
    expect(userGroupRole.group).toEqual(groupData.id)
    expect(userGroupRole.role).toEqual('ADMIN')

    const joinedData = await getUserJoinedGroups(userData2.token)

    const joinedGroup = joinedData.joinedGroups.find(
      (g) => g.groupId === groupData.id
    )

    expect(joinedGroup.groupId.toString()).toEqual(groupData.id)
    expect(joinedGroup.role).toEqual('ADMIN')
  })

  it('user group role change does not work with incorrect role', async () => {
    const userData1 = await createTestUser()
    const userData2 = await createUser(
      testUser2.name,
      testUser2.username,
      testUser2.email,
      testUser2.password
    )

    const groupData = await createGroup(
      'testGroup',
      'test description',
      userData1.token
    )
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
    expect(result.body.errors).toBeDefined()
  })
})
