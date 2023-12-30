const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 20000,
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
