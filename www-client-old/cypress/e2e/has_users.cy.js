//import { gql } from '@apollo/client'

/*
const query = 'mutation foo { createUser(user: { name: "nepo", email: "huppa@jeep", username: "rocketman", password: "hulivili" } ) { id }}'
cy.request({
      method: 'post',
      url: 'http://localhost:4000/graphql',
      body: { query }
    }).then((res) => {
      console.log(res.body)
    })
*/

describe('template spec', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:4000/test/reset')
  })

  it('passes', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Texter', { matchCase: false })
  })

  it('create user succeeds', function () {
    cy.visit('http://localhost:3000')
    cy.get('#name').type('Mare Pare')
    cy.get('#username').type('mare')
    cy.get('#email').type('mare@kiikari.com')
    cy.get('#password').type('kikkulakakkula')
    cy.get('#create-button').click()
    cy.visit('http://localhost:3000/test/allusers')
    cy.contains('Mare Pare')
  })
})