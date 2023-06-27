describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

  it('has users', () => {
    cy.visit('http://localhost:3000')
    cy.contains('mare')
  })
})