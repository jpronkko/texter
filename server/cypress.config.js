const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 60000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    options: {
      browser: 'chrome',
    },
    setupNodeEvents(on, config) {
      return config
    },
  },
})
