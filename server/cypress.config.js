const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 20000,
    options: {
      browser: 'chrome',
    },
    setupNodeEvents(on, config) {
      return config
    },
  },
})
