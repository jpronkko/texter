const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'frryer',
  e2e: {
    defaultCommandTimeout: 60000,
    viewportWidth: 1200,
    viewportHeight: 768,
    options: {
      browser: 'chrome',
    },
    setupNodeEvents(on, config) {
      return config
    },
  },
})
