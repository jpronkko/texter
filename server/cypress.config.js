const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 2000,
    options: {
      browser: 'chrome',
    },
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
