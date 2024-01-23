const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'frryer',
  e2e: {
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
