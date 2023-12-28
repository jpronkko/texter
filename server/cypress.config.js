const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          cy.task('log', message)
          return null
        },
      })
    },
  },
})
