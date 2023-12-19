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

Cypress.Commands.add('openPage', () => {
  cy.visit(main_url)
})

Cypress.Commands.add('openPageWithToken', () => {
  const storedToken = JSON.parse(localStorage.getItem('texter-token'))
  cy.visit(main_url, {
    onBeforeLoad: (win) => {
      win.localStorage.setItem('texter-token', JSON.stringify(storedToken))
    },
  })
})

Cypress.Commands.add('apiMutation', (mutations) => {
  cy.request({
    method: 'POST',
    url: 'api/graphql',
    body: { query: 'mutation' + mutations },
  })
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
  }).then((body) => {
    cy.log('user added', body)
    const userData = body.data.createUser
    window.localStorage.setItem('texter-login', JSON.stringify(userData))
    window.localStorage.setItem('texter-token', JSON.stringify(userData.token))
  })
})

Cypress.Commands.add('addGroup', ({ name, description }) => {
  const mutation = `mutation CreateGroup { createGroup(name: "${name}", description: "${description}"){ id name description ownerId } }`
  const storedToken = JSON.parse(localStorage.getItem('texter-token'))

  cy.request({
    method: 'POST',
    url: api_url,
    headers: { Authorization: `bearer ${storedToken['token']}` },
    body: { query: mutation },
  }).then((result) => {
    console.log('group added', result)
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

Cypress.Commands.add('login', ({ username, password }) => {
  const mutation = `mutation Login { login(username: "${username}", password: "${password}"){ token userId username email name } }`
  cy.request({
    method: 'POST',
    url: api_url,
    body: { query: mutation },
  }).then((body) => {
    const userData = body.data.login
    window.localStorage.setItem('texter-login', JSON.stringify(userData))
    window.localStorage.setItem('texter-token', JSON.stringify(userData.token))
    console.log('user logged in', body)
  })
})
