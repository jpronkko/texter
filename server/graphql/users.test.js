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
  login,
  loginTestUser,
  resetDatabases,
  getUserJoinedGroups,
  testUser,
  testUser2,
} = require('../utils/testHelpers')

const { findUserByUsername } = require('../models/users.model')
const { response } = require('express')

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
    const user = await findUserByUsername(testUser.username)
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

    const groupData = await createGroup(
      'testGroup',
      'test description',
      loginResponse.token
    )
    console.log('group data', groupData)

    const joinedData = await getUserJoinedGroups(loginResponse.token)

    expect(joinedData.userId).toEqual(userData.userId)
    const group = joinedData.joinedGroups[0]
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
    console.log('result', response.body)
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
    console.log('result', result.body)
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
    console.log('result', response.body)

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
    console.log('result', response.body)
    const result = response.body.data.changeEmail

    expect(result.id).toEqual(userData.userId)
    expect(result.email).toEqual(newEmail)
    expect(result.username).toEqual(userData.username)
    expect(result.name).toEqual(userData.name)
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
    console.log('Response', userGroupRole)
    expect(userGroupRole.user).toEqual(userData2.userId)
    expect(userGroupRole.group).toEqual(groupData.id)
    expect(userGroupRole.role).toEqual('MEMBER')

    const joinedData = await getUserJoinedGroups(userData2.token)

    const joinedGroup = joinedData.joinedGroups[0]
    expect(joinedGroup.groupId.toString()).toEqual(groupData.id)
    expect(joinedGroup.role).toEqual('MEMBER')
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
    expect(firstJoinedData.joinedGroups).toHaveLength(1)

    const query = `mutation RemoveUserFromGroup {
        removeUserFromGroup(userId: "${userData2.userId}" groupId: "${groupData.id}") {
            joinedGroups {
              description
              groupId
              groupName
              role
            }
            userId
        }
      }`

    const response = await gqlToServer(url, query, userData1.token)
    //const result = response.body.data.removeUserFromGroup
    console.log('resp', response.body.data)
    //console.log('result', result)

    //const secodJoinedData = await getUserJoinedGroups(userData2.token)

    //expect(secodJoinedData.joinedGroups).toEqual([])
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

    const groupData = await createGroup(
      'testGroup',
      'test group',
      userData1.token
    )
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

    const joinedData = await getUserJoinedGroups(userData2.token)

    const joinedGroup = joinedData.joinedGroups[0]

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
    console.log(result.body)
    expect(result.body.errors).toBeDefined()
  })
})
