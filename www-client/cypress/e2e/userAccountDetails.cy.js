describe('user account details', function () {
  beforeEach(function () {
    cy.resetData()
    cy.fixture('user1.json')
      .as('user1')
      .then((user1) => {
        cy.print('prn log' + JSON.stringify(user1))
        cy.addUser({
          username: this.user1.username,
          name: this.user1.name,
          email: this.user1.email,
          password: this.user1.password,
        })
        cy.login({
          username: this.user1.username,
          password: this.user1.password,
        })
      })
  })

  it('change e-mail works with correct password', function () {
    const newEmail = 'newemail@newemail.com'
    cy.get('#usermenu-button').click()
    cy.get('#usermenu-profile').click()
    cy.get('#new-email-button').click()
    cy.get('#password').type(this.user1.password)

    cy.get('#email').clear()
    cy.get('#email').type(newEmail)
    cy.get('#email_repeat').clear()
    cy.get('#email_repeat').type(newEmail)

    cy.get('#submit-email-button').click()
    cy.get('#user-email').contains(newEmail)
  })

  it('change e-mail does not work with incorrect password', function () {
    const newEmail = 'newemail@newemail.com'
    cy.get('#usermenu-button').click()
    cy.get('#usermenu-profile').click()
    cy.get('#new-email-button').click()
    cy.get('#password').type(this.user1.password + 'p')

    cy.get('#email').clear()
    cy.get('#email').type(newEmail)
    cy.get('#email_repeat').clear()
    cy.get('#email_repeat').type(newEmail)

    cy.get('#submit-email-button').click()
    cy.get('#error-dialog-message').contains('wrong password')
    cy.get('#error-dialog-ok-button').click()
    cy.get('#cancel-email-button').click()
    cy.get('#user-email').contains(this.user1.email)
  })

  it('change password works with correct password', function () {
    const newPassword = 'newpassword'
    cy.get('#usermenu-button').click()
    cy.get('#usermenu-profile').click()
    cy.get('#new-password-button').click()
    cy.get('#old-password').type(this.user1.password)
    cy.get('#new-password').type(newPassword)
    cy.get('#password-repeat').type(newPassword)
    cy.get('#submit-password-button').click()
    cy.logout()
    cy.location('pathname').should('eq', '/login')
    cy.login({
      username: this.user1.username,
      password: newPassword,
    })
    cy.location('pathname').should('eq', '/')
  })

  it('change password does not work with incorrect password', function () {
    const newPassword = 'newpassword'
    cy.get('#usermenu-button').click()
    cy.get('#usermenu-profile').click()
    cy.get('#new-password-button').click()
    cy.get('#old-password').type(this.user1.password + 'p')
    cy.get('#new-password').type(newPassword)
    cy.get('#password-repeat').type(newPassword)
    cy.get('#submit-password-button').click()
    cy.get('#error-dialog-message').contains('wrong password')
    cy.get('#error-dialog-ok-button').click()
    cy.get('#cancel-password-button').click()
    cy.logout()
    cy.location('pathname').should('eq', '/login')
    cy.login({
      username: this.user1.username,
      password: newPassword,
    })
    cy.location('pathname').should('eq', '/login')
  })
})
