const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          cy.task('log', message)
          //console.log(message + '\n\n')
          return null
        },
      })
    },
  },
})
