describe('template spec', function () {
  beforeEach(function () {
    cy.resetData()
    cy.fixture('user1.json').as('user1')
    cy.fixture('user2.json').as('user2')
    cy.addUser({
      username: this.user1.username,
      name: this.user1.name,
      email: this.user1.email,
      password: this.user1.password,
    })
  })

  it('create group', function () {
    cy.openPageWithToken()
    cy.get('#create-group-button').click()
    cy.get('#name').type('testgroup')
    cy.get('#description').type('testdescription')
    cy.get('#create-submit-button').click()
    cy.get('#notify-message').contains('Group testgroup created')
  })
})
