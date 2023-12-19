describe('template spec', function () {
  beforeEach(function () {
    cy.resetData()
    cy.fixture('user1.json').as('user1')
    cy.fixture('user2.json').as('user2')
  })

  it('passes', function () {
    cy.openPage()
    cy.contains('Texter', { matchCase: false })
  })

  it('create user succeeds', function () {
    cy.openPage()
    cy.get('#create-new-button').click()
    cy.get('#name').type(this.user1.name)
    cy.get('#username').type(this.user1.username)
    cy.get('#email').type(this.user1.email)
    cy.get('#password').type(this.user1.password)
    cy.get('#create-submit-button').click()
    cy.get('#notify-message').contains(`${this.user1.username} has logged in!`)
  })

  it('login', function () {
    cy.addUser({
      username: this.user1.username,
      name: this.user1.name,
      email: this.user1.email,
      password: this.user1.password,
    })
    cy.openPage()
    cy.get('#username').type(this.user1.username)
    cy.get('#password').type(this.user1.password)
    cy.get('#login-button').click()
    cy.get('#notify-message').contains(`${this.user1.username} has logged in!`)
  })
})