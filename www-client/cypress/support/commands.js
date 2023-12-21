// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { api_url, main_url, reset_url } from './connections'

Cypress.Commands.add('resetData', () => {
  cy.request('POST', reset_url)
})

Cypress.Commands.add('print', (message) => {
  cy.task('log', message)
})

Cypress.Commands.add('openPage', () => {
  cy.visit(main_url)
})

Cypress.Commands.add('openPageWithToken', () => {
  //const storedToken = JSON.parse(localStorage.getItem('texter-token'))
  /*cy.visit(main_url, {
    onBeforeLoad: (win) => {
      win.localStorage.setItem('texter-token', JSON.stringify(storedToken))
    },
  })*/
  cy.visit(main_url)
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
  })
})

Cypress.Commands.add('login', ({ username, password }) => {
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
      cy.task('log', 'Login error: ' + JSON.stringify(result.body.errors))
      return
    }
    const userData = result.body.data.login
    cy.task('log', 'Login: ' + JSON.stringify(userData))
    localStorage.setItem('texter-login', JSON.stringify(userData))
    localStorage.setItem('texter-token', userData.token)
    cy.visit(main_url)
  })
})

Cypress.Commands.add('logout', () => {
  cy.get('#usermenu-button').click()
  cy.get('#usermenu').contains('Logout').click()
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

Cypress.Commands.add('goGroupMangePage', () => {
  cy.get('#group-name')
    .contains('testgroup')
    .parent()
    .get('#manage-group-button')
    .click()
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
  cy.task('log', 'group add stored token' + storedToken)

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
    console.log('user added to group', result)
  })
})
