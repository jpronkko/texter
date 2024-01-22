/* eslint-disable no-console */
import { api_url, main_url, reset_url } from './connections'
import { aliasMutation, aliasQuery } from './utils'

Cypress.Commands.add('resetData', () => {
  cy.request('POST', reset_url)
})

Cypress.Commands.add('openPage', () => {
  cy.visit(main_url)
  //cy.location('pathname').should('eq', '/')
})

Cypress.Commands.add('addUser', ({ username, name, email, password }) => {
  const mutation = `mutation CreateUser { createUser(user: 
    { name: "${name}", 
      username: "${username}", 
      email: "${email}", 
      password: "${password}" 
    }){ 
      token
      userId
      username
      email
      name
      }
     }`

  cy.request({
    method: 'POST',
    url: api_url,
    body: { query: mutation },
  }).then((result) => {
    // eslint-disable-next-line no-console
    console.log('addUser:', JSON.stringify(result.body))
  })
})

// Cypress.Commands.add('login', ({ username, password }) => {
//   cy.intercept('POST', api_url, (req) => {
//     aliasQuery(req, 'GetUserJoinedGroups')
//   }) //.as('gqlGetUserJoinedGroupsQuery')
//   cy.openPage()
//   cy.get('#username').type(username)
//   cy.get('#password').type(password)
//   cy.get('#login-button').click()

//   cy.wait('@gqlGetUserJoinedGroupsQuery')
//     .its('response.body.data')
//     .should('not.be.empty')
//   cy.get('#usermenu-button').should('contain', username)
//   //cy.get('#notify-message').contains(`${username} has logged in!`)
// })

Cypress.Commands.add('login', ({ username, password }) => {
  cy.intercept('POST', api_url, (req) => {
    Cypress.log({
      displayName: 'login intercept',
      message: JSON.stringify(req.body),
    })
    aliasQuery(req, 'GetUserJoinedGroups')
    aliasMutation(req, 'Login')
  }) //.as('gqlGetUserJoinedGroupsQuery')

  const mutation = `mutation Login {
    login(credentials: { username: "${username}",
    password: "${password}"
  }){ token userId username email name } }`

  cy.request({
    method: 'POST',
    url: api_url,
    body: { query: mutation },
  }).then((result) => {
    if (result.body.errors) {
      // eslint-disable-next-line no-console
      console.log('login:', JSON.stringify(result.body.errors))
      return
    }
    const userData = result.body.data.login
    localStorage.setItem('texter-login', JSON.stringify(userData))
    localStorage.setItem('texter-token', userData.token)
    cy.visit(main_url)

    /*cy.wait('@gqlLoginMutation')
      .its('response.body.data')
      .should('not.be.empty')*/
    cy.wait('@gqlGetUserJoinedGroupsQuery')
      .its('response.body.data')
      .should('not.be.empty')

    cy.get('#usermenu-button').should('contain', userData.username)
    Cypress.log({ displayName: 'login:', message: JSON.stringify(result.body) })
  })
})

Cypress.Commands.add('logout', () => {
  cy.get('#usermenu-button').click()
  cy.get('#usermenu').contains('Logout').as('logout')
  cy.get('@logout').click()
  cy.get('#confirm-ok-button').click()
})

Cypress.Commands.add('createTestGroup', () => {
  cy.fixture('testgroup.json')
    .as('testgroup')
    .then((testgroup) => {
      cy.get('#create-group-button').click()
      cy.get('#name').type(testgroup.name)
      cy.get('#description').type(testgroup.description)
      cy.get('#create-submit-button').click()
    })
})

Cypress.Commands.add('goGroupManagePage', () => {
  //cy.get('#group-name')
  cy.contains('testgroup')
    .parent()
    .find('#manage-group-button')
    .as('manageGroupButton')
  cy.get('@manageGroupButton').click()
})

Cypress.Commands.add('createInvitation', (name) => {
  cy.get('#add-invitation-button').click()
  cy.get('#user-label').contains(name).get('#user-checkbox').click()
  cy.get('#selection-ok-button').click()
})

Cypress.Commands.add('acceptInvitation', (name) => {
  cy.get('#invitation-menu-button').click()
  cy.get('#invitation-label')
    .contains(name)
    .parent()
    .get('#invitation-accept-button')
    .click()
})

Cypress.Commands.add('addGroup', ({ name, description }) => {
  const mutation = `mutation CreateGroup { createGroup(name: "${name}", description: "${description}"){ id name description ownerId } }`
  const storedToken = localStorage.getItem('texter-token')

  cy.request({
    method: 'POST',
    url: api_url,
    headers: { Authorization: `bearer ${storedToken}` },
    body: { query: mutation },
  }).then((result) => {
    cy.task('log', 'group add' + JSON.stringify(result))
  })
})

Cypress.Commands.add('addUserToGroup', ({ userId, groupId }) => {
  const mutation = `mutation AddUserToGroup { addUserToGroup(userId: "${userId}", groupId: "${groupId}"){ user group role } }`
  const storedToken = JSON.parse(localStorage.getItem('texter-token'))

  cy.request({
    method: 'POST',
    url: api_url,
    headers: { Authorization: `bearer ${storedToken['token']}` },
    body: { query: mutation },
  }).then((result) => {
    cy.task('log', 'group add' + JSON.stringify(result))
  })
})
