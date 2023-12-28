describe('main page', function () {
  it('main page loads', function () {
    cy.openPage()
    cy.contains('Texter', { matchCase: false })
  })
})
