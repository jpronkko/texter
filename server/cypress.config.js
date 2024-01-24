const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // Cypress will use this projectId to find the project
  projectId: 'frryer',
  e2e: {
    // Cypress will use this timeout for all commands
    // it is important to have this high enough for slow virtual machines in CI/CD
    // pipelines
    defaultCommandTimeout: 60000,
    viewportWidth: 1600,
    viewportHeight: 1024,
    options: {
      browser: 'chrome',
    },
    setupNodeEvents(on, config) {
      return config
    },
  },
})
