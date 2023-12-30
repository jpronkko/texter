describe('group creation, selection, user invitations to group', function () {
  beforeEach(function () {
    cy.resetData()
    cy.fixture('user1.json')
      .as('user1')
      .then(() => {
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

    cy.fixture('user2.json').as('user2')
    cy.fixture('testgroup.json').as('testgroup')
  })

  it('common group exists and can post to general topic', function () {
    cy //.get('#other-joined-groups')
      //.find('#group-name')
      .contains('Common')
      .parent()
      .parent()
      //.contains('Common')
      .find('#select-group-button')
      .as('selectGroupButton')

    cy.get('@selectGroupButton').click()
    cy.get('#select-topic-button').contains('General').as('selectTopicButton')
    cy.get('@selectTopicButton').click()
    cy.get('#message-input').type('test message')
    cy.get('#submit-message-button').click()
    cy.get('#message').contains('test message')
  })

  it('create group', function () {
    cy.createTestGroup()
    cy.get('#owned-groups').contains(this.testgroup.name)
    cy.get('#owned-groups').get('#group-name').contains(this.testgroup.name)
    cy.get('#owned-groups')
      .find('#group-description')
      .contains(this.testgroup.description)
  })

  it('post message to test topic in test group', function () {
    cy.createTestGroup()
    cy.get('#owned-groups')
      .get('#group-name')
      .contains(this.testgroup.name)
      .parent()
      .get('#select-group-button')
      .click()
    cy.get('#add-topic-button').click()
    cy.get('#input').type('testtopic')
    cy.get('#submit-button').click()
    cy.get('#select-topic-button').contains('testtopic').click()
    cy.get('#message-input').type('testmessage')
    cy.get('#submit-message-button').click()
    cy.get('#message').contains('testmessage')
  })

  it('change group name and description', function () {
    cy.createTestGroup()
    cy.goGroupManagePage()
    cy.get('#group-name-change-button').click()
    cy.get('#input').type('newtestgroup')
    cy.get('#submit-button').click()
    cy.get('#group-name-title').contains('newtestgroup')
    cy.get('#group-description-change-button').click()
    cy.get('#input').type('newtestdescription')
    cy.get('#submit-button').click()
    cy.get('#group-description-title').contains('newtestdescription')
  })

  it('invite user to group and accept invitation works', function () {
    cy.addUser({
      username: this.user2.username,
      name: this.user2.name,
      email: this.user2.email,
      password: this.user2.password,
    })
    cy.createTestGroup()
    cy.goGroupManagePage()
    cy.createInvitation(this.user2.name)

    cy.get('#group-members-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
    cy.logout()

    cy.login({
      username: this.user2.username,
      password: this.user2.password,
    })

    cy.acceptInvitation(this.testgroup.name)
    cy.get('#other-joined-groups').get('#group-name').contains('Common')
    cy.contains(this.testgroup.name) //get('#other-joined-groups').get(this.testgroup.name)
  })

  it('invite user to group and cancel invitation works', function () {
    cy.addUser({
      username: this.user2.username,
      name: this.user2.name,
      email: this.user2.email,
      password: this.user2.password,
    })
    cy.createTestGroup()
    cy.goGroupManagePage()
    cy.createInvitation(this.user2.name)

    cy.get('#group-members-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
    cy.get('#invitations-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
      .parent()
      .get('#cancel-invitation-button')
      .click()
    cy.get('#confirm-ok-button').click()
    cy.get('#invitations-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
      .parent()
      .parent()
      .contains('Cancelled')
  })

  it('invite user to group and reject invitation works', function () {
    cy.addUser({
      username: this.user2.username,
      name: this.user2.name,
      email: this.user2.email,
      password: this.user2.password,
    })
    cy.createTestGroup()
    cy.goGroupManagePage()
    cy.createInvitation(this.user2.name)

    cy.get('#group-members-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
    cy.logout()

    cy.login({
      username: this.user2.username,
      password: this.user2.password,
    })

    cy.get('#invitation-menu-button').click()
    cy.get('#invitation-label')
      .contains(this.testgroup.name)
      .parent()
      .get('#invitation-reject-button')
      .click()
    cy.logout()
    cy.login({
      username: this.user1.username,
      password: this.user1.password,
    })
    cy.goGroupManagePage()
    cy.get('#invitations-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
      .parent()
      .parent()
      .contains('Rejected')
  })

  it('invite user to group and remove user from group works', function () {
    cy.addUser({
      username: this.user2.username,
      name: this.user2.name,
      email: this.user2.email,
      password: this.user2.password,
    })
    cy.createTestGroup()
    cy.goGroupManagePage()
    cy.createInvitation(this.user2.name)
    cy.logout()

    cy.login({
      username: this.user2.username,
      password: this.user2.password,
    })

    cy.get('#invitation-menu-button').click()
    cy.get('#invitation-label')
      .contains(this.testgroup.name)
      .parent()
      .get('#invitation-accept-button')
      .click()
    cy.logout()

    cy.login({
      username: this.user1.username,
      password: this.user1.password,
    })
    cy.goGroupManagePage()
    cy.get('#group-members-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
      .parent()
      .parent()
      .within(() => {
        cy.get('#remove-user-button').click()
      })
    cy.get('#confirm-ok-button').click()
    cy.get('#group-members-table')
      .get('.MuiDataGrid-cell')
      .contains(this.user2.username)
      .should('not.exist')
  })

  it('leave group', function () {
    cy.addUser({
      username: this.user2.username,
      name: this.user2.name,
      email: this.user2.email,
      password: this.user2.password,
    })
    cy.createTestGroup()
    cy.goGroupManagePage()
    cy.createInvitation(this.user2.name)
    cy.logout()

    cy.login({
      username: this.user2.username,
      password: this.user2.password,
    })

    cy.acceptInvitation(this.testgroup.name)

    cy.get('#leave-group-button').click()
    cy.get('#confirm-ok-button').click()
    cy.get('#group-name').should('not.include.text', this.testgroup.name)
  })
})
